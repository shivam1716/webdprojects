import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  FolderKanban,
  FileText,
  Mic,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  MessageSquareText,
  Sparkles,
  Share2,
  UploadCloud,
  Trash2,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge, { statusTone } from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'
import { useProjects } from '../hooks/useProjects'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../services/api'
import { useToast } from '../components/ui/Toaster'
import { cn } from '../utils/cn'

const quickActions = [
  { label: 'Upload Audio', icon: Mic, to: '/upload', desc: 'MP3, WAV, M4A', soon: true },
  { label: 'Upload Transcript', icon: FileText, to: '/upload', desc: 'TXT, DOCX, PDF' },
  { label: 'Import CSV', icon: FileSpreadsheet, to: '/upload', desc: 'Survey results' },
]

const activityIcons = {
  report: FileText,
  insight: Sparkles,
  upload: UploadCloud,
  share: Share2,
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { projects, isLoading } = useProjects()
  const { openNewProjectModal } = useOutletContext()
  const { addToast } = useToast()

  const handleDelete = async (e, projectId, title) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm(`Are you sure you want to delete project "${title}"? This action cannot be undone.`)) return

    try {
      await apiFetch(`/projects/${projectId}`, { method: 'DELETE' })
      addToast('Project deleted successfully', 'success')
      window.dispatchEvent(new CustomEvent('projectCreated'))
    } catch (error) {
      addToast(error.message || 'Failed to delete project', 'error')
    }
  }

  const recentProjects = projects.slice(0, 4)
  const hasProjects = recentProjects.length > 0

  const [stats, setStats] = useState({ projects: 0, uploads: 0, reports: 0 })
  const [activities, setActivities] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiFetch('/projects/stats')
        if (res.data) setStats(res.data)
      } catch (e) {
        console.error(e)
      }
    }
    const fetchActivity = async () => {
      try {
        const res = await apiFetch('/projects/activity')
        if (res.data) setActivities(res.data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchStats()
    fetchActivity()
    
    const handleProjectCreated = () => {
      fetchStats()
      fetchActivity()
    }
    
    window.addEventListener('projectCreated', handleProjectCreated)
    return () => window.removeEventListener('projectCreated', handleProjectCreated)
  }, [])

  const hasActivity = activities.length > 0

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <p className="text-sm text-ink-soft">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto">
      {/* Header & Quick Actions */}
      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-ink">Good morning, {user?.name?.split(' ')[0] || 'User'}</h1>
            <p className="mt-1 text-[14px] text-ink-soft">Here's what's happening in your workspace.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-raised hover:border-border-strong"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-sunken text-ink group-hover:bg-accent-soft group-hover:text-accent transition-colors">
                <action.icon className="size-[18px]" strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium text-ink">{action.label}</p>
                  {action.soon && (
                    <span className="rounded-full bg-sunken px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-ink-faint uppercase">
                      Soon
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[13px] text-ink-faint">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mt-2">
          <Card className="flex flex-col gap-1 p-5">
            <span className="text-[13px] font-medium text-ink-soft">Total Projects</span>
            <span className="text-2xl font-semibold text-ink">{stats.projects}</span>
          </Card>
          <Card className="flex flex-col gap-1 p-5">
            <span className="text-[13px] font-medium text-ink-soft">Total Uploads</span>
            <span className="text-2xl font-semibold text-ink">{stats.uploads}</span>
          </Card>
          <Card className="flex flex-col gap-1 p-5">
            <span className="text-[13px] font-medium text-ink-soft">Total Reports</span>
            <span className="text-2xl font-semibold text-ink">{stats.reports}</span>
          </Card>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Recent Projects */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-medium text-ink">Recent Projects</h2>
            <Link to="/projects" className="flex items-center gap-1 text-[13px] font-medium text-ink-soft hover:text-ink transition-colors">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {hasProjects ? (
            <div className="flex flex-col gap-3">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/analysis/${p.id}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-all hover:border-border-strong hover:shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sunken text-ink-soft group-hover:bg-accent-soft group-hover:text-accent transition-colors">
                      <FolderKanban className="size-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-ink">{p.title}</p>
                      <p className="mt-0.5 truncate text-[13px] text-ink-soft">
                        {p.file_count || 0} files · Created {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <Badge tone={statusTone(p.status)} className="hidden sm:inline-flex">{p.status}</Badge>
                    <button 
                      onClick={(e) => handleDelete(e, p.id, p.title)}
                      className="text-ink-faint hover:text-danger transition-colors p-1"
                      title="Delete Project"
                    >
                      <Trash2 className="size-4" strokeWidth={2} />
                    </button>
                    <ArrowRight className="size-4 text-ink-faint group-hover:text-ink transition-colors" strokeWidth={2} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              compact
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to start uploading customer sources."
              actionLabel="Create project"
              actionIcon={Plus}
              onAction={openNewProjectModal}
            />
          )}
        </section>

        {/* Activity Feed */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between h-[22px]">
            <h2 className="text-[15px] font-medium text-ink">Activity</h2>
          </div>

          <Card padding="p-0" className="overflow-hidden">
            {hasActivity ? (
              <ul className="divide-y divide-border">
                {activities.slice(0, 5).map((a) => {
                  const Icon = activityIcons[a.type] || MessageSquareText
                  return (
                    <li key={a.id} className="flex items-start gap-3 px-5 py-4">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-sunken text-ink-soft">
                        <Icon className="size-3.5" strokeWidth={2} />
                      </span>
                      <p className="text-[13px] leading-relaxed text-ink-soft">
                        <span className="font-medium text-ink">{a.actor}</span> {a.action}{' '}
                        <span className="font-medium text-ink">{a.target}</span>
                        <span className="block mt-1 text-[11.5px] text-ink-faint">{new Date(a.time).toLocaleString()}</span>
                      </p>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="p-6">
                <EmptyState compact title="No activity yet" description="Your team's activity will appear here." />
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  )
}
