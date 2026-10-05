import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Plus, FolderKanban, Users, Files, AlertTriangle, LayoutGrid, List, Trash2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge, { statusTone } from '../components/ui/Badge'
import SearchBar from '../components/ui/SearchBar'
import EmptyState from '../components/ui/EmptyState'
import Avatar from '../components/ui/Avatar'
import { useProjects } from '../hooks/useProjects'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toaster'
import { apiFetch } from '../services/api'
import { cn } from '../utils/cn'

const filters = ['All', 'Active', 'In review', 'Completed', 'Archived']

export default function ProjectsPage() {
  const { user } = useAuth()
  const { projects, isLoading } = useProjects()
  const { openNewProjectModal } = useOutletContext()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [view, setView] = useState('grid')
  const { addToast } = useToast()

  const handleDelete = async (e, projectId, title) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm(`Are you sure you want to delete project "${title}"? This action cannot be undone.`)) return

    try {
      await apiFetch(`/projects/${projectId}`, { method: 'DELETE' })
      addToast('Project deleted successfully', 'success')
      window.dispatchEvent(new CustomEvent('projectCreated')) // Refresh globally
    } catch (error) {
      addToast(error.message || 'Failed to delete project', 'error')
    }
  }

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesQuery = (p.title || '').toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'All' || p.status === filter
      return matchesQuery && matchesFilter
    })
  }, [query, filter, projects])

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        description="Every study your team is running, in one place."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={query} onChange={setQuery} placeholder="Search projects..." className="sm:max-w-xs" />
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-surface border border-border p-1 shadow-flat">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'whitespace-nowrap rounded-[6px] px-3 py-1.5 text-xs font-medium transition-colors',
                  filter === f ? 'bg-sunken text-ink shadow-sm' : 'text-ink-soft hover:text-ink hover:bg-canvas'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-surface border border-border p-1 shadow-flat">
            <button
              onClick={() => setView('grid')}
              className={cn('rounded-[6px] p-1.5 transition-colors', view === 'grid' ? 'bg-sunken shadow-sm text-ink' : 'text-ink-faint hover:text-ink hover:bg-canvas')}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('rounded-[6px] p-1.5 transition-colors', view === 'list' ? 'bg-sunken shadow-sm text-ink' : 'text-ink-faint hover:text-ink hover:bg-canvas')}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <p className="text-sm text-ink-soft">Loading projects...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects match your filters"
          description="Try a different search term or clear your filters to see all projects."
          actionLabel="Clear filters"
          onAction={() => {
            setQuery('')
            setFilter('All')
          }}
        />
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} interactive className="flex flex-col gap-4 group">
              <Link to={`/analysis/${p.id}`} className="flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-sunken text-ink-soft transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                    <FolderKanban className="size-[18px]" strokeWidth={2} />
                  </span>
                  <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                </div>
                <div>
                  <h3 className="text-[14.5px] font-semibold text-ink group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[13px] text-ink-soft">{p.description || 'No description provided.'}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {[]?.map((s) => (
                    <Badge key={s} tone="neutral" className="bg-canvas border-border">
                      {s}
                    </Badge>
                  ))}
                </div>
              </Link>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-3 text-[12px] text-ink-faint">
                  <span className="flex items-center gap-1">
                    <Files className="size-3.5" /> {p.file_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="size-3.5" /> 0
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleDelete(e, p.id, p.title)}
                    className="text-ink-faint hover:text-danger transition-colors p-1"
                    title="Delete Project"
                  >
                    <Trash2 className="size-4" strokeWidth={2} />
                  </button>
                  <Avatar name={user?.name || 'User'} size="xs" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="p-0">
          <ul className="divide-y divide-border">
            {filtered.map((p) => (
              <li key={p.id}>
                <Link to={`/analysis/${p.id}`} className="group flex flex-col gap-3 px-5 py-4 hover:bg-sunken sm:flex-row sm:items-center sm:justify-between transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-canvas border border-border text-ink-soft group-hover:bg-accent-soft group-hover:text-accent group-hover:border-transparent transition-all">
                      <FolderKanban className="size-4" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-ink group-hover:text-accent transition-colors">{p.title}</p>
                      <p className="truncate text-[13px] text-ink-soft mt-0.5">{p.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 pl-14 sm:pl-0">
                    <span className="flex items-center gap-1.5 text-[12px] text-ink-faint">
                      <Files className="size-3.5" /> {p.file_count || 0} files
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] text-ink-faint">
                      <Users className="size-3.5" /> {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                    <button 
                      onClick={(e) => handleDelete(e, p.id, p.title)}
                      className="text-ink-faint hover:text-danger transition-colors p-1"
                      title="Delete Project"
                    >
                      <Trash2 className="size-4" strokeWidth={2} />
                    </button>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
