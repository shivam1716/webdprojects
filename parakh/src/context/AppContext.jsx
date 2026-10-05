import {createContext,useContext,useMemo,useState} from 'react';
import {merchantResults,datasetInfo} from '../data/realData';
const AppContext=createContext(null);
export function AppProvider({children}){
 const [role,setRole]=useState(localStorage.getItem('parakh_role')||null);
 const [userName,setUserName]=useState(localStorage.getItem('parakh_name')||'');
 const [fraudSaved,setFraudSaved]=useState(0);
 const [runs,setRuns]=useState([]);
 const [selectedMerchantId,setSelectedMerchantId]=useState(null);
 const [activity,setActivity]=useState(false);
 const merchants=merchantResults();
 const login=(name,selectedRole)=>{const n=name||selectedRole;setRole(selectedRole);setUserName(n);localStorage.setItem('parakh_role',selectedRole);localStorage.setItem('parakh_name',n);if(!selectedMerchantId&&merchants[0])setSelectedMerchantId(merchants[0].id)};
 const logout=()=>{setRole(null);setUserName('');localStorage.removeItem('parakh_role');localStorage.removeItem('parakh_name')};
 const addRun=run=>setRuns(r=>[run,...r]);
 const value=useMemo(()=>({role,userName,login,logout,fraudSaved,setFraudSaved,runs,addRun,selectedMerchantId,setSelectedMerchantId,activity,setActivity,merchants,dataset:datasetInfo()}),[role,userName,fraudSaved,runs,selectedMerchantId,activity]);
 return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export const useApp=()=>useContext(AppContext);
