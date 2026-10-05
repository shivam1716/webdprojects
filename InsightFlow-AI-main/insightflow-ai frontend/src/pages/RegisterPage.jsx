import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Building2, ArrowRight, Check } from 'lucide-react'
import Button from '../components/ui/Button'
import Input, { Label } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toaster'

const perks = ['Free for up to 50 files', 'No credit card required', 'Cancel anytime']

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { addToast } = useToast()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const name = `${firstName} ${lastName}`.trim()
      await register(name, email, password)
      addToast('Registration successful! Please log in.', 'success')
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Create your account</h1>
      <p className="mt-1.5 text-sm text-ink-soft">Start turning customer feedback into decisions.</p>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
        {perks.map((p) => (
          <li key={p} className="flex items-center gap-1.5 text-xs text-ink-soft">
            <Check className="size-3.5 text-success" strokeWidth={2.5} />
            {p}
          </li>
        ))}
      </ul>

      {error && (
        <div className="mt-5 rounded-md bg-error/10 p-3 text-sm text-error border border-error/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" icon={User} placeholder="Maya" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Chen" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" icon={Building2} placeholder="Northstar" />
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" icon={Mail} placeholder="you@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" icon={Lock} placeholder="Create a password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" fullWidth icon={ArrowRight} iconPosition="right" className="mt-1" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-ink-faint">
        By continuing, you agree to InsightFlow's{' '}
        <a href="#" className="text-ink-soft hover:text-ink">Terms of Service</a> and{' '}
        <a href="#" className="text-ink-soft hover:text-ink">Privacy Policy</a>.
      </p>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:text-accent-hover">
          Log in
        </Link>
      </p>
    </div>
  )
}

