import { Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, UploadCloud, Sparkles, FileBarChart, MessagesSquare, ArrowRight } from 'lucide-react'
import Logo from '../components/ui/Logo'

const nav = [
  { to: '#', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { to: '#', label: 'Projects', icon: FolderKanban },
  { to: '#', label: 'Upload', icon: UploadCloud },
  { to: '#', label: 'Analysis', icon: Sparkles },
  { to: '#', label: 'Reports', icon: FileBarChart },
  { to: '#', label: 'AI Chat', icon: MessagesSquare },
]

export default function DemoDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-canvas text-ink font-sans">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-border bg-canvas transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0">
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 opacity-60 pointer-events-none">
          {nav.map(({ to, label, icon: Icon, active }) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors ${
                active ? 'bg-accent-soft text-accent-active' : 'text-ink-soft'
              }`}
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={2} />
              {label}
            </div>
          ))}
        </nav>
        
        <div className="border-t border-border p-5 text-center">
          <Link to="/login" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
            Sign in for full access
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <div className="w-full bg-accent text-white px-4 py-2.5 text-center text-[13.5px] font-medium flex items-center justify-center gap-2">
          You are viewing a static demo of the dashboard.
          <Link to="/login" className="underline hover:text-white/80 inline-flex items-center gap-1">
            Sign in to use all features <ArrowRight className="size-3.5" />
          </Link>
        </div>
        
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-canvas/80 px-4 backdrop-blur-md sm:px-8 pointer-events-none opacity-60">
          <div className="flex items-center gap-4 text-ink">
            <span className="text-[14px] font-medium">Dashboard</span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto w-full max-w-7xl animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
