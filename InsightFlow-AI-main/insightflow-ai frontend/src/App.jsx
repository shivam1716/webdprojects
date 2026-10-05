import AppRoutes from './routes/AppRoutes'
import { ToastProvider } from './components/ui/Toaster'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}
