import {Outlet} from 'react-router-dom';
import {useApp} from '../context/AppContext';
import Rail from './Rail'; import TopBar from './TopBar'; import LehrField from './LehrField';
export default function AppShell(){
 const {role,activity}=useApp();
 return <div className="min-h-screen relative bg-touch"><LehrField speed={activity?.speed||.16} dimmed/>
   <div className="flex min-h-screen relative"><Rail role={role}/><main className="flex-1 min-w-0"><TopBar/><div className="p-7 max-w-[1500px] mx-auto"><Outlet/></div></main></div>
 </div>
}
