import struct, zlib

class T:
    def __init__(s,b,p=0): s.b=b; s.p=p
    def byte(s): v=s.b[s.p]; s.p+=1; return v
    def varint(s):
        r=0; sh=0
        while True:
            x=s.byte(); r|=(x&0x7f)<<sh
            if not x&0x80: return r
            sh+=7
    def zz(s): n=s.varint(); return (n>>1)^-(n&1)
    def val(s,t):
        if t==1: return True
        if t==2: return False
        if t==3: return struct.unpack('b',bytes([s.byte()]))[0]
        if t in(4,5,6): return s.zz()
        if t==7: v=struct.unpack('<d',s.b[s.p:s.p+8])[0]; s.p+=8; return v
        if t==8: n=s.varint(); v=s.b[s.p:s.p+n]; s.p+=n; return v
        if t in(9,10):
            h=s.byte(); n=h>>4; et=h&15
            if n==15: n=s.varint()
            out=[]
            for _ in range(n):
                out.append(s.byte()==1 if et in(1,2) else s.val(et))
            return out
        if t==12: return s.struct()
        raise ValueError('thrift type %d'%t)
    def struct(s):
        d={}; last=0
        while True:
            h=s.byte()
            if h==0: return d
            t=h&15; delta=h>>4
            fid=last+delta if delta else s.zz()
            last=fid
            d[fid]=s.val(t)

def snappy(b):
    p=0; n=0; sh=0
    while True:
        x=b[p]; p+=1; n|=(x&0x7f)<<sh
        if not x&0x80: break
        sh+=7
    out=bytearray()
    while p<len(b):
        tag=b[p]; p+=1; k=tag&3
        if k==0:
            ln=tag>>2
            if ln>=60:
                nb=ln-59; ln=int.from_bytes(b[p:p+nb],'little'); p+=nb
            ln+=1; out+=b[p:p+ln]; p+=ln
        else:
            if k==1: ln=((tag>>2)&7)+4; off=((tag>>5)<<8)|b[p]; p+=1
            elif k==2: ln=(tag>>2)+1; off=int.from_bytes(b[p:p+2],'little'); p+=2
            else: ln=(tag>>2)+1; off=int.from_bytes(b[p:p+4],'little'); p+=4
            for _ in range(ln): out.append(out[-off])
    assert len(out)==n,(len(out),n)
    return bytes(out)

def decomp(codec,b):
    if codec==0: return b
    if codec==1: return snappy(b)
    if codec==2: return zlib.decompress(b,31)
    raise NotImplementedError('codec %d'%codec)

def rle(b,p,width,count,end):
    out=[]
    while len(out)<count and p<end:
        h=0; sh=0
        while True:
            x=b[p]; p+=1; h|=(x&0x7f)<<sh
            if not x&0x80: break
            sh+=7
        if h&1:
            groups=h>>1; nbytes=groups*width
            bits=int.from_bytes(b[p:p+nbytes],'little'); p+=nbytes
            mask=(1<<width)-1
            for i in range(groups*8): out.append((bits>>(i*width))&mask)
        else:
            run=h>>1; nb=(width+7)//8
            v=int.from_bytes(b[p:p+nb],'little'); p+=nb
            out.extend([v]*run)
    return out[:count]

def plain(b,ptype,n):
    if ptype==6:
        out=[];p=0
        for _ in range(n):
            l=struct.unpack('<I',b[p:p+4])[0]; p+=4; out.append(b[p:p+l].decode('utf8')); p+=l
        return out
    if ptype==2: return list(struct.unpack('<%dq'%n,b[:8*n]))
    if ptype==1: return list(struct.unpack('<%di'%n,b[:4*n]))
    if ptype==5: return list(struct.unpack('<%dd'%n,b[:8*n]))
    if ptype==4: return list(struct.unpack('<%df'%n,b[:4*n]))
    raise NotImplementedError('ptype %d'%ptype)

def read(path):
    b=open(path,'rb').read()
    assert b[:4]==b'PAR1' and b[-4:]==b'PAR1'
    fl=struct.unpack('<I',b[-8:-4])[0]
    meta=T(b,len(b)-8-fl).struct()
    schema=meta[2]; leaves=[s for s in schema[1:]]
    cols={s[4].decode():[] for s in leaves}
    optional={s[4].decode():s.get(3)==1 for s in leaves}
    for rg in meta[4]:
        for cc in rg[1]:
            cm=cc[3]; name=cm[3][-1].decode(); ptype=cm[1]; codec=cm[4]; total=cm[5]
            start=cm.get(11) or cm[9]
            if cm.get(11) and cm[11]>cm[9]: start=cm[9]
            p=start; dic=None; vals=[]
            while len(vals)<total:
                t=T(b,p); ph=t.struct(); p=t.p
                comp=b[p:p+ph[3]]; p+=ph[3]
                if ph[1]==2:
                    dic=plain(decomp(codec,comp),ptype,ph[7][1]); continue
                if ph[1]==0:
                    dh=ph[5]; n=dh[1]; enc=dh[2]
                    raw=decomp(codec,comp); q=0
                    if optional[name]:
                        ll=struct.unpack('<I',raw[q:q+4])[0]; q+=4
                        defs=rle(raw,q,1,n,q+ll); q+=ll
                    else: defs=[1]*n
                elif ph[1]==3:
                    dh=ph[8]; n=dh[1]; enc=dh[4]
                    rl=dh.get(6,0); dl=dh.get(5,0)
                    lv=comp[:rl+dl]; body=comp[rl+dl:]
                    if dh.get(7,True): body=decomp(codec,body)
                    defs=rle(lv,rl,1,n,rl+dl) if optional[name] else [1]*n
                    raw=body; q=0
                else: raise NotImplementedError('page type')
                nn=sum(defs)
                if enc in(2,8):
                    w=raw[q]; q+=1
                    idx=rle(raw,q,w,nn,len(raw)); v=[dic[i] for i in idx]
                elif enc==0: v=plain(raw[q:],ptype,nn)
                else: raise NotImplementedError('enc %d'%enc)
                it=iter(v)
                vals.extend(next(it) if d else None for d in defs)
            cols[name].extend(vals)
    return cols,meta[3]
