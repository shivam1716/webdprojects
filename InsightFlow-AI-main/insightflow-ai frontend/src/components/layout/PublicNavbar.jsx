import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../ui/Logo'
import Button from '../ui/Button'

const links = [
  { to: '#product', label: 'Product' },
  { to: '#workflow', label: 'Workflow' },
]

export default function PublicNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/">
          <Logo textClassName="text-white" accentClassName="text-slate-400" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="text-[13.5px] font-medium text-slate-400 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button as={Link} to="/login" variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
            Sign In
          </Button>
          <Button as={Link} to="/demo" size="sm" className="bg-white hover:bg-slate-200 text-black border border-transparent shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
            Try Demo
          </Button>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex size-9 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0A0A0A] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Button as={Link} to="/login" variant="secondary" fullWidth className="bg-white/5 text-white border-white/10 hover:bg-white/10">
              Sign In
            </Button>
            <Button as={Link} to="/demo" fullWidth className="bg-white hover:bg-slate-200 text-black border border-transparent">
              Try Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
