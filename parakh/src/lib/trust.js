// Every number here is computed from the loaded Olist data (realData.json). No seeded or simulated values.
export const WEIGHTS=[['cancel','Cancellation rate',.25,m=>m.cancelRate,'cr'],['late','Late-delivery rate',.25,m=>m.lateRate,'lr'],['review','Low customer reviews',.15,m=>5-m.reviewAvg,'lo'],['top','Single-customer concentration',.2,m=>m.topCustomerShare,'top'],['shared','Shared-customer network',.15,m=>m.sharedCustomerRate,'ov']];
const cache=new WeakMap();
const dist=all=>{if(!cache.has(all)){const d={};WEIGHTS.forEach(([,, ,g,k])=>d[k]=all.map(g).sort((a,b)=>a-b));cache.set(all,d)}return cache.get(all)};
export const pct=(a,v)=>{let lo=0,hi=a.length;while(lo<hi){const mid=(lo+hi)>>1;if(a[mid]<=v)lo=mid+1;else hi=mid}return Math.round(lo/a.length*100)};
const fmt={cancel:v=>`${v}% of orders cancelled`,late:v=>`${v}% delivered after the estimate`,review:v=>`${(5-v).toFixed(2)}/5 average review`,top:v=>`top customer = ${v}% of orders`,shared:v=>`${v}% of customers also buy from other sellers`};
export function scoreOf(vals,all){const d=dist(all);const f=WEIGHTS.map(([key,label,w,,k])=>{const p=pct(d[k],vals[key]);return{key,label,w,pct:p,points:-Math.round(w*p*10)/10,value:`${fmt[key](vals[key])} · higher than ${p}% of sellers`}});
 return{score:Math.max(20,Math.min(98,Math.round(100-f.reduce((a,x)=>a-x.points,0)))),factors:f}}
const vals=m=>Object.fromEntries(WEIGHTS.map(([k,,,g])=>[k,g(m)]));
export function explain(m,all,edges=[]){const r=scoreOf(vals(m),all),ev=m.evidence||{},E=edges.filter(e=>e.seller===m.id).map(e=>e.orderId);
 const map={cancel:ev.cancelled,late:ev.late,review:ev.lowReview,top:E,shared:E};r.factors.forEach(f=>{f.ev=map[f.key]||[]});return r}
export const carat=s=>`${Math.max(12,Math.min(24,Math.round(s/4.15)))}K`;
// Stress: mechanical what-if on the seller's own real metrics, re-scored against real distributions.
export function stress(m,all,{demand=0,downtime=0,sales=0}){const v=vals(m),keep=(1-demand/100)*(1-sales/100),dn=Math.min(30,downtime)/30;
 v.top=Math.min(100,m.topCustomerShare/Math.max(keep,.01));
 v.cancel=m.cancelRate+dn*(100-m.cancelRate);v.late=m.lateRate+dn*(100-m.lateRate);
 return{...scoreOf(v,all),revenue:m.revenue*keep*(1-dn)}}
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[s.length>>1]};
export function actions(m,all){const base=scoreOf(vals(m),all).score;const tgt={cancel:med(all.map(x=>x.cancelRate)),late:med(all.map(x=>x.lateRate)),review:med(all.map(x=>5-x.reviewAvg)),top:med(all.map(x=>x.topCustomerShare)),shared:med(all.map(x=>x.sharedCustomerRate))};
 const txt={cancel:'Bring cancellations down to the peer median',late:'Bring late deliveries down to the peer median',review:'Lift average review to the peer median',top:'Reduce dependence on the largest customer to the peer median',shared:'Bring shared-customer rate to the peer median'};
 return WEIGHTS.map(([k])=>{const v=vals(m);if(v[k]<=tgt[k])return null;v[k]=tgt[k];return{text:txt[k],target:tgt[k],delta:scoreOf(v,all).score-base}}).filter(Boolean).sort((a,b)=>b.delta-a.delta)}
export const leak=m=>({cancelled:m.revenue*m.cancelRate/100,late:m.revenue*m.lateRate/100,freight:m.freight});
const mean=a=>a.reduce((x,y)=>x+y,0)/(a.length||1),sd=a=>{const u=mean(a);return Math.sqrt(a.reduce((x,y)=>x+(y-u)**2,0)/Math.max(1,a.length-1))};
const cmp=(a,b)=>{const x=a.map(m=>m.score),y=b.map(m=>m.score),gap=mean(x)-mean(y),se=Math.sqrt(sd(x)**2/x.length+sd(y)**2/y.length);return{na:x.length,nb:y.length,ma:mean(x),mb:mean(y),gap,se,sig:Math.abs(gap)>2*se}};
export function fairness(all){const bySt={},byCity={};all.forEach(m=>{bySt[m.state]=(bySt[m.state]||0)+1;byCity[m.city]=(byCity[m.city]||0)+1});
 const topState=Object.entries(bySt).sort((a,b)=>b[1]-a[1])[0][0],medCity=med(Object.values(byCity)),medOrd=med(all.map(m=>m.orders));
 const defs=[[`Sellers in ${topState} vs other states`,m=>m.state===topState],['Sellers in multi-seller cities vs isolated sellers',m=>byCity[m.city]>medCity],['Higher-volume vs lower-volume sellers',m=>m.orders>medOrd]];
 const out=defs.map(([label,f])=>{const raw=cmp(all.filter(f),all.filter(m=>!f(m)));const bands=[all.filter(m=>m.orders<=medOrd),all.filter(m=>m.orders>medOrd)].map(b=>{const c=cmp(b.filter(f),b.filter(m=>!f(m)));return c.na>1&&c.nb>1?c:null}).filter(Boolean);
  const adj=bands.length?mean(bands.map(b=>b.gap)):null,adjSig=bands.some(b=>b.sig);
  const drivers=WEIGHTS.map(([k,l])=>{const a=all.filter(f).map(m=>scoreOf(vals(m),all).factors.find(x=>x.key===k).points),b=all.filter(m=>!f(m)).map(m=>scoreOf(vals(m),all).factors.find(x=>x.key===k).points);return[l,mean(a)-mean(b)]}).sort((x,y)=>Math.abs(y[1])-Math.abs(x[1]));
  return{label,raw,adj,drivers,verdict:!raw.sig?'No statistically significant gap.':label.startsWith('Higher')?'Score differs with volume. This is a behavioural difference, not a location effect.':adj!=null&&!adjSig?'Significant gap, but it disappears within the same volume band: explained by seller volume and behaviour.':'Gap persists within the same volume band, so volume does not explain it. Review before use.'}});
 return{out,medOrd,topState}}
export function clusters(edges){const cs={};edges.forEach(e=>(cs[e.customer]??=new Map).set(e.seller,e.orderId));
 return Object.entries(cs).filter(([,m])=>m.size>1).map(([c,m])=>({customer:c,sellers:[...m.keys()],orders:[...m.values()]}))}
export async function sha(s){return[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('')}
export async function proof(m,r,ds){const pl=JSON.stringify({v:1,seller:m.id,score:r.score,factors:r.factors.map(f=>[f.label,f.points]),metrics:[m.orders,m.revenue,m.cancelRate,m.lateRate,m.reviewAvg],source:ds.source,generatedAt:ds.generatedAt});return{pl,hash:await sha(pl)}}
export const R=v=>'R$ '+Math.round(v).toLocaleString('en-IN');
export function speech(m,r){
  const w=[...r.factors].sort((a,b)=>a.points-b.points)[0];
  const labelHi={
    'Cancellation rate':'रद्दीकरण दर',
    'Late-delivery rate':'देरी से डिलीवरी दर',
    'Low customer reviews':'कम ग्राहक समीक्षाएं',
    'Single-customer concentration':'एकल-ग्राहक एकाग्रता',
    'Shared-customer network':'साझा-ग्राहक नेटवर्क',
  };
  const dragLabel=labelHi[w.label]||w.label;
  return `व्यापारी ${m.id.slice(0,8)} का परख स्कोर ${r.score} में से सौ है। स्कोर पर सबसे बड़ा असर ${dragLabel} का है, जिसके कारण ${Math.abs(w.points)} अंक कम हुए हैं।`;
}
export function ask(q,{m,r,all,edges,ds}){q=q.toLowerCase();
 if(/why|reason|factor|explain|how.*score/.test(q))return r.factors.map(f=>`${f.label}: ${f.points} points (${f.value})`).join('\n');
 if(/score/.test(q))return`Seller ${m.id.slice(0,8)} has a Parakh score of ${r.score}/100 (${carat(r.score)}).`;
 if(/leak|loss|cancel/.test(q)){const l=leak(m);return`Observed cancelled-order value is ${R(l.cancelled)}, revenue on late deliveries is ${R(l.late)}, and freight is ${R(l.freight)}.`}
 if(/ring|fraud|cluster|anomal|suspicious/.test(q)){const c=clusters(edges);return`${c.length} customer(s) link more than one high-anomaly seller in the loaded network sample. This seller's network anomaly score is ${m.networkAnomaly}/100. These are anomaly indicators, not confirmed fraud.`}
 if(/fair|bias/.test(q)){const f=fairness(all).out;return f.map(x=>`${x.label}: ${x.raw.gap.toFixed(1)} points. ${x.verdict}`).join('\n')}
 if(/top|best|highest/.test(q)){const t=[...all].sort((a,b)=>b.score-a.score).slice(0,3);return'Top sellers by score: '+t.map(x=>`${x.id.slice(0,8)} (${x.score})`).join(', ')}
 if(/data|quality|reject|duplicate/.test(q))return`${ds.summary.orders.toLocaleString('en-IN')} orders loaded; ${ds.quality.duplicates} duplicates and ${ds.quality.rejected} rejected rows; ${ds.quality.keptPercent}% kept.`;
 return'There is no data for that.'}
