import { Link, Outlet, Navigate } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import { useAuth } from '../context/AuthContext'

const quotes = [
  {
    text: 'InsightFlow turned six weeks of interview backlog into a report our whole team actually read.',
    author: 'Dana Whitfield',
    role: 'Head of Product, Fernway',
  },
]

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth()
  const quote = quotes[0]
  
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-canvas">
      <div className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-16 lg:py-10 bg-surface">
        <Link to="/">
          <Logo />
        </Link>

        <div className="mx-auto w-full max-w-sm py-10">
          <Outlet />
        </div>

        <p className="text-center text-xs text-ink-faint lg:text-left">
          © 2026 InsightFlow AI, Inc.
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-black lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="relative flex h-full flex-col justify-between p-14 text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center gap-3 text-[13px] font-medium text-slate-400">
              <span className="flex size-2 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              Live analysis
            </div>
            <p className="mt-4 font-mono text-sm leading-relaxed text-slate-300">
              Detected 6 new pain points in <span className="text-white">Support Ticket Triage — Q3</span>
            </p>
            <svg className="mt-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" width="100%" height="56" viewBox="0 0 320 56" fill="none">
              <path
                d="M0 40L30 30L60 44L90 18L120 34L150 8L180 30L210 20L240 38L270 14L300 28L320 20"
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <blockquote>
            <p className="text-2xl font-medium leading-snug tracking-tight text-white">
              "{quote.text}"
            </p>
            <footer className="mt-5 text-sm text-slate-400">
              {quote.author} — {quote.role}
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
