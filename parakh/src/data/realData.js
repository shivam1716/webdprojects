import {explain} from '../lib/trust';
import data from './realData.json';
export function datasetReady(){return Boolean(data?.ready)}
export function datasetInfo(){return data||{ready:false}}
export function generateMerchants(){return data?.merchants||[]}
export function merchantResults(){return generateMerchants()}
export function getMerchantById(id){return generateMerchants().find(m=>m.id===id)||generateMerchants()[0]||null}
export function getProducts(){return data?.products||[]}
export function getProductById(id){return getProducts().find(p=>p.id===id)||null}
export function getFraudSignals(){return data?.fraudSignals||[]}
export function networkData(){return data?.edges||[]}
export function getFieldCatalog(){return data?.fieldCatalog||[]}
export function scoreMerchant(merchant){
 if(!merchant)return {score:0,carat:'—',factors:[]};
 const r=explain(merchant,generateMerchants(),data?.edges||[]);
 return {score:merchant.score,carat:merchant.carat,factors:r.factors.map(f=>({key:f.key,label:f.label,points:f.points,value:f.value,ev:f.ev}))};
}
export function validationReport(){const s=data?.summary||{};return {received:s.orders||0,duplicates:data?.quality?.duplicates||0,rejected:data?.quality?.rejected||0,kept:data?.quality?.kept||s.orders||0,percentage:data?.quality?.keptPercent||'100.00',rejectedRows:data?.quality?.rejectedRows||[],source:'Olist real dataset'}}
