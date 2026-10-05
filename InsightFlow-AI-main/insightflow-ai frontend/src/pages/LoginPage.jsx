import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import Input, { Label } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toaster'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await login(email, password)
      addToast('Logged in successfully', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Welcome back</h1>
      <p className="mt-1.5 text-sm text-ink-soft">Log in to keep analyzing customer signal.</p>

      {error && (
        <div className="mt-5 rounded-md bg-error/10 p-3 text-sm text-error border border-error/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" icon={Mail} placeholder="you@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs font-medium text-accent hover:text-accent-hover">
              Forgot password?
            </a>
          </div>
          <Input id="password" type="password" icon={Lock} placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" fullWidth icon={ArrowRight} iconPosition="right" className="mt-1" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-ink-soft">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-accent hover:text-accent-hover">
          Sign up free
        </Link>
      </p>
    </div>
  )
}

