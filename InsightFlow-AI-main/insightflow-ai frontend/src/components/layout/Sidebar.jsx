import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  UploadCloud,
  Sparkles,
  FileBarChart,
  MessagesSquare,
  User,
  X,
  LogOut,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Logo from '../ui/Logo'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/upload', label: 'Upload', icon: UploadCloud },
  { to: '/analysis', label: 'Analysis', icon: Sparkles },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/chat', label: 'AI Chat', icon: MessagesSquare },
]

export default function Sidebar({ open = false, onClose }) {
  const { user, logout } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-border bg-canvas transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/">
            <Logo />
          </Link>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-ink-faint hover:bg-sunken lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors',
                  isActive
                    ? 'bg-accent-soft text-accent-active'
                    : 'text-ink-soft hover:bg-sunken hover:text-ink'
                )
              }
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors',
                isActive ? 'bg-accent-soft text-accent-active' : 'text-ink-soft hover:bg-sunken hover:text-ink'
              )
            }
          >
            <User className="size-[18px]" strokeWidth={2} />
            Profile
          </NavLink>
          {user && (
            <div className="mt-2 flex items-center justify-between rounded-md px-3 py-2 hover:bg-sunken group">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={user.name || 'User'} size="sm" src={user.avatar_url} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-ink">{user.name}</p>
                  <p className="truncate text-[11.5px] text-ink-faint">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="text-ink-faint hover:text-error opacity-0 group-hover:opacity-100 transition-opacity p-1"
                title="Log out"
              >
                <LogOut className="size-4" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
