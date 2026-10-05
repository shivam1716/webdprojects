import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import Button from '../components/ui/Button'
import Logo from '../components/ui/Logo'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <Link to="/" className="mb-10">
        <Logo />
      </Link>

      <svg width="140" height="80" viewBox="0 0 140 80" fill="none" className="mb-8">
        <path
          d="M0 56L24 40L48 62L72 20L96 48L120 12L140 32"
          stroke="var(--color-border-strong)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="72" cy="20" r="4.5" fill="var(--color-accent)" />
      </svg>

      <span className="font-mono text-sm font-medium text-accent">404</span>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        No signal on this page.
      </h1>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">
        The page you're looking for doesn't exist, or may have moved. Let's get you back to your data.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button as={Link} to="/dashboard" icon={Compass}>
          Go to dashboard
        </Button>
        <Button as={Link} to="/" variant="secondary" icon={ArrowLeft}>
          Back to home
        </Button>
      </div>
    </div>
  )
}
