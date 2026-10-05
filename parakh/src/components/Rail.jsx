import {NavLink} from 'react-router-dom';
import {Home,Workflow,Store,PackageSearch,IndianRupee,ShieldAlert,Scale,Pickaxe,FileBadge,History,Landmark,ShieldCheck} from 'lucide-react';
const items=[
 ['Home','/','home',Home],['Workflows','/workflows','workflows',Workflow],['Merchants','/merchants','merchants',Store],['Products','/products','products',PackageSearch],['India Market','/india','india',IndianRupee],
 ['Fraud','/fraud','fraud',ShieldAlert],['Tarazu','/tarazu','tarazu',Scale],['Pathar Test','/pathar-test','pathar',Pickaxe],['Trust Lab','/trust','trust',ShieldCheck],
 ['Certificates','/certificates','certificates',FileBadge],['History','/history','history',History],['Loan Matchmaker','/loan-matchmaker','loan',Landmark]
];
export default function Rail({role}){
 const visible=items.filter(x=> role==='Lender' ? ['certificates','loan','trust'].includes(x[2]) : role==='Merchant' ? !['fraud','tarazu','loan'].includes(x[2]) : x[2]!=='loan');
 return <aside className="w-[188px] shrink-0 border-r border-white/10 bg-touch/85 min-h-screen p-4">
   <div className="serif text-2xl text-bone px-2 pb-6 pt-1">Parakh</div>
   <nav className="space-y-1">{visible.map(([label,to,key,Icon])=><NavLink key={key} to={to} className={({isActive})=>`flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm ${isActive?'bg-surface text-gold':'text-muted hover:text-bone'}`}><Icon size={15} strokeWidth={1.4}/>{label}</NavLink>)}</nav>
 </aside>
}
