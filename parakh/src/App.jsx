import {Navigate,Route,Routes} from 'react-router-dom';
import {useApp} from './context/AppContext';
import AppShell from './components/AppShell';
import Login from './pages/Login';
import Home from './pages/Home';
import Workflows from './pages/Workflows';
import Merchants from './pages/Merchants';
import Products from './pages/Products';
import MerchantDetail from './pages/MerchantDetail';
import Fraud from './pages/Fraud';
import Tarazu from './pages/Tarazu';
import Certificates from './pages/Certificates';
import LoanMatchmaker from './pages/LoanMatchmaker';
import History from './pages/History';
import Generic from './pages/Generic';
import Verify from './pages/Verify';
import India from './pages/India';
import TrustLab from './pages/TrustLab';
function Protected({children,roles}){const {role}=useApp();if(!role)return <Navigate to="/login" replace/>;if(roles&&!roles.includes(role))return <Navigate to="/" replace/>;return children}
export default function App(){
 return <Routes><Route path="/login" element={<Login/>}/><Route element={<Protected><AppShell/></Protected>}>
  <Route index element={<Home/>}/><Route path="/workflows" element={<Workflows/>}/><Route path="/merchants" element={<Merchants/>}/><Route path="/products" element={<Products/>}/><Route path="/india" element={<India/>}/><Route path="/trust" element={<TrustLab/>}/><Route path="/merchants/:id" element={<MerchantDetail/>}/>
  <Route path="/fraud" element={<Protected roles={['Ops Analyst']}><Fraud/></Protected>}/><Route path="/tarazu" element={<Protected roles={['Ops Analyst']}><Tarazu/></Protected>}/>
  <Route path="/pathar-test" element={<MerchantDetail/>}/><Route path="/certificates" element={<Certificates/>}/><Route path="/loan-matchmaker" element={<Protected roles={['Lender']}><LoanMatchmaker/></Protected>}/><Route path="/history" element={<History/>}/>
  <Route path="/verify/:id" element={<Verify/>}/><Route path="/settings" element={<Generic title="Settings"/>}/>
 </Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>
}
