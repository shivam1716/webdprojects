import { Link } from 'react-router-dom'
import {
  FolderKanban,
  FileText,
  Mic,
  FileSpreadsheet,
  ArrowRight,
  MessageSquareText,
  Sparkles,
  Share2,
  UploadCloud,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge, { statusTone } from '../components/ui/Badge'

const quickActions = [
  { label: 'Upload Audio', icon: Mic, to: '#', desc: 'MP3, WAV, M4A', soon: true },
  { label: 'Upload Transcript', icon: FileText, to: '#', desc: 'TXT, DOCX, PDF' },
  { label: 'Import CSV', icon: FileSpreadsheet, to: '#', desc: 'Survey results' },
]

const activityIcons = {
  report: FileText,
  insight: Sparkles,
  upload: UploadCloud,
  share: Share2,
}

const mockProjects = [
  { id: '1', title: 'Q3 Customer Feedback', file_count: 14, created_at: new Date().toISOString(), status: 'analyzing' },
  { id: '2', title: 'Onboarding Flow Redesign', file_count: 8, created_at: new Date(Date.now() - 86400000).toISOString(), status: 'ready' },
  { id: '3', title: 'Pricing Survey 2026', file_count: 2, created_at: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'ready' },
  { id: '4', title: 'Churn Interviews', file_count: 5, created_at: new Date(Date.now() - 86400000 * 7).toISOString(), status: 'error' },
]

const mockActivities = [
  { id: '1', type: 'insight', actor: 'Sarah Jenkins', action: 'generated a new insight report in', target: 'Q3 Customer Feedback', time: new Date().toISOString() },
  { id: '2', type: 'upload', actor: 'Alex Chen', action: 'uploaded 3 transcripts to', target: 'Onboarding Flow Redesign', time: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', type: 'share', actor: 'Marcus Doe', action: 'shared the dashboard for', target: 'Pricing Survey 2026', time: new Date(Date.now() - 7200000).toISOString() },
]

export default function DemoDashboardPage() {
  const stats = { projects: 12, uploads: 145, reports: 28 }

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto opacity-95 pointer-events-none">
      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-ink">Good morning, Guest</h1>
            <p className="mt-1 text-[14px] text-ink-soft">Here's what's happening in your workspace.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <div
              key={action.label}
              className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-sunken text-ink">
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
            </div>
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
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-medium text-ink">Recent Projects</h2>
            <div className="flex items-center gap-1 text-[13px] font-medium text-ink-soft">
              View all <ArrowRight className="size-3.5" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {mockProjects.map((p) => (
              <div
                key={p.id}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sunken text-ink-soft">
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
                  <ArrowRight className="size-4 text-ink-faint" strokeWidth={2} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between h-[22px]">
            <h2 className="text-[15px] font-medium text-ink">Activity</h2>
          </div>

          <Card padding="p-0" className="overflow-hidden">
            <ul className="divide-y divide-border">
              {mockActivities.map((a) => {
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
          </Card>
        </section>
      </div>
    </div>
  )
}
