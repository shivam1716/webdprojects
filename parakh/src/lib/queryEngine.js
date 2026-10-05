import {merchantResults,getProducts} from '../data/realData';
const norm=s=>String(s||'').toLowerCase();
const SELLER_METRICS=[[/anomal|unusual|suspicious|fraud|concentration|risk/,'anomalyScore','network anomaly score'],[/late|delay|delivery/,'lateRate','late-delivery rate'],[/cancel/,'cancelRate','cancellation rate'],[/review/,'reviewAvg','average review'],[/order|volume/,'orders','order count'],[/score|health|trust/,'score','Parakh score']];
function parse(prompt,controls={}){const p=norm(prompt),products=/product|categor|price|item/.test(p)&&!/seller|merchant/.test(p);
 let rows=products?getProducts():merchantResults().map(m=>({...m,anomalyScore:m.networkAnomaly}));const filters=[];
 const states=[...new Set(merchantResults().map(m=>m.state))],tok=(String(prompt).match(/\b[A-Z]{2}\b/g)||[]).find(t=>states.includes(t)),st=controls.state&&controls.state!=='All'?controls.state:tok;
 if(st&&!products){rows=rows.filter(r=>r.state===st);filters.push(`state = ${st}`)}
 if(!products){const cities=[...new Set(rows.map(r=>r.city))].filter(c=>c&&c.length>3).sort((a,b)=>b.length-a.length),c=cities.find(c=>p.includes(norm(c)));if(c&&!st){rows=rows.filter(r=>r.city===c);filters.push(`city = ${c}`)}}
 if(products){const cats=[...new Set(rows.map(r=>r.category))].filter(Boolean),c=controls.category&&controls.category!=='All'?controls.category:cats.find(c=>p.includes(norm(c).replace(/_/g,' '))||p.includes(norm(c)));if(c){rows=rows.filter(r=>r.category===c);filters.push(`category = ${c}`)}}
 const lo=Number(controls.minValue),hi=Number(controls.maxValue);if(controls.minValue!==''&&controls.minValue!=null&&Number.isFinite(lo)){rows=rows.filter(r=>r.revenue>=lo);filters.push(`revenue >= R$ ${lo}`)}if(controls.maxValue!==''&&controls.maxValue!=null&&Number.isFinite(hi)){rows=rows.filter(r=>r.revenue<=hi);filters.push(`revenue <= R$ ${hi}`)}
 let metric='revenue',label='revenue';if(products){if(/price/.test(p)){metric='avgPrice';label='average price'}else if(/order|volume|demand/.test(p)){metric='orders';label='order count'}}else{const h=SELLER_METRICS.find(([re])=>re.test(p));if(h){metric=h[1];label=h[2]}}
 const asc=/lowest|least|worst|smallest|minimum|fewest/.test(p)&&!(/late|cancel|anomal|risk/.test(p)),n=Number((p.match(/\btop\s+(\d{1,3})\b/)||[])[1])||50;
 return{p,products,rows,filters,metric,label,asc,n}}
export function workflowSteps(prompt,controls={}){const a=parse(prompt,controls),ent=a.products?'products':'sellers';
 return[`Interpret request as ${ent} ranked by ${a.label}`,a.filters.length?`Apply filters: ${a.filters.join(', ')}`:`Use all ${a.rows.length.toLocaleString('en-IN')} loaded ${ent}`,`Calculate ${a.label} from source fields`,'Compare values against the dataset distribution','Attach source IDs and observable fields',`Prepare ${a.rows.length.toLocaleString('en-IN')} matching records for review`]}
export function buildAnalysis(prompt,controls={}){const a=parse(prompt,controls),rows=[...a.rows].sort((x,y)=>(Number(y[a.metric]||0)-Number(x[a.metric]||0))*(a.asc?-1:1));
 return{entity:a.products?'products':'sellers',metric:a.metric,filters:a.filters,total:a.rows.length,rows:rows.slice(0,a.n),title:a.products?'Product analysis':'Seller analysis',reason:`Ranked by ${a.label} (${a.asc?'lowest':'highest'} first) across ${a.rows.length.toLocaleString('en-IN')} matching records in the loaded Olist data.`}}
