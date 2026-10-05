import data from './indiaData.json';
export function indiaReady(){return Boolean(data?.ready)}
export function getIndiaData(){return data||{ready:false}}
