import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Mic,
  Ticket,
  ClipboardList,
  FileText,
  UploadCloud,
  Sparkles,
  FileBarChart,
  LayoutTemplate,
  AlertTriangle,
  Network,
  MessageSquareText,
  Download,
  MessageSquare,
  StickyNote,
  FileSpreadsheet,
  Globe,
  BarChart3,
} from 'lucide-react'
import Button from '../components/ui/Button'

const sources = [
  { icon: Ticket, label: 'Support Tickets' },
  { icon: FileText, label: 'Customer Interviews (Transcripts)', comingSoon: 'Audio → Transcript' },
  { icon: ClipboardList, label: 'Survey Responses' },
  { icon: MessageSquare, label: 'Product Feedback' },
  { icon: StickyNote, label: 'Internal Notes' },
  { icon: FileSpreadsheet, label: 'CSV Exports' },
]

const features = [
  {
    icon: LayoutTemplate,
    title: 'Executive Summary',
    description: 'A concise overview of your customer research.',
  },
  {
    icon: AlertTriangle,
    title: 'Top Pain Points',
    description: 'Automatically ranked by impact and frequency.',
  },
  {
    icon: Network,
    title: 'Key Themes',
    description: 'Cluster repeated customer feedback into actionable themes.',
  },
  {
    icon: MessageSquareText,
    title: 'AI Workspace Chat',
    description: 'Ask questions grounded only in your uploaded project data.',
  },
  {
    icon: Download,
    title: 'Export Reports',
    description: 'Generate professional PDF reports for stakeholders.',
  }
]

const steps = [
  { n: '01', title: 'Upload', description: 'Upload PDFs, DOCX, TXT files, customer feedback, support tickets, interview transcripts and CSV exports.', icon: UploadCloud },
  { n: '02', title: 'Analyze', description: 'InsightFlow AI extracts recurring pain points, customer themes, user segments and recommendations.', icon: Sparkles },
  { n: '03', title: 'Report', description: 'Generate structured reports, executive summaries and chat with your project using AI.', icon: FileBarChart },
]

const comingSoon = [
  {
    icon: Mic,
    title: 'Audio Interview Analysis',
    description: 'Automatically convert customer interview recordings into transcripts before analysis.',
  },
  {
    icon: Globe,
    title: 'Multi-language Support',
    description: 'Analyze customer feedback across multiple languages.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics Dashboard',
    description: 'Track sentiment and metrics over time.',
  }
]

function SignalPreview() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-black/60 p-5 shadow-2xl backdrop-blur-xl sm:p-7 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="size-3 rounded-full bg-slate-500/80 shadow-[0_0_8px_rgba(100,116,139,0.6)]" />
          <span className="size-3 rounded-full bg-slate-400/80 shadow-[0_0_8px_rgba(148,163,184,0.6)]" />
          <span className="size-3 rounded-full bg-slate-300/80 shadow-[0_0_8px_rgba(203,213,225,0.6)]" />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-500/30 bg-slate-500/10 px-3 py-1 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
          <span className="size-1.5 animate-pulse rounded-full bg-slate-300" />
          <span className="text-[11px] font-medium tracking-wide text-slate-300 uppercase">Live analysis</span>
        </div>
      </div>
      
      <div className="relative grid gap-6 pt-6 sm:grid-cols-5">
        <div className="sm:col-span-3 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top pain points this week</p>
          {[
            { t: 'Multi-step signup verification', v: 88, c: 'bg-slate-300' },
            { t: 'Stale invoice totals on billing page', v: 71, c: 'bg-slate-400' },
            { t: 'No report preview before export', v: 46, c: 'bg-slate-500' },
          ].map((row) => (
            <div key={row.t} className="group">
              <div className="flex items-center justify-between text-[13px] mb-2">
                <span className="text-slate-200 group-hover:text-white transition-colors">{row.t}</span>
                <span className="font-mono text-slate-400">{row.v}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full ${row.c} shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-1000 ease-out`}
                  style={{ width: `${row.v}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="sm:col-span-2 rounded-xl border border-white/5 bg-white/[0.03] p-5 shadow-inner">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sentiment Trend</p>
          <svg className="mt-4 w-full drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" height="60" viewBox="0 0 220 60" fill="none">
            <path
              d="M0 40L20 30L40 45L60 20L80 34L100 10L120 28L140 15L160 36L180 10L200 24L220 14"
              stroke="#e2e8f0"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse-line"
            />
            <path
              d="M0 40L20 30L40 45L60 20L80 34L100 10L120 28L140 15L160 36L180 10L200 24L220 14"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#94a3b8" />
                <stop offset="1" stopColor="#f1f5f9" />
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-4 flex items-end gap-2">
            <p className="font-mono text-3xl font-semibold text-white">+18%</p>
            <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
               vs. last month
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="bg-[#0A0A0A] text-slate-300 selection:bg-white/20 selection:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-white/[0.05] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-24 sm:px-8 sm:pb-32 sm:pt-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="animate-fade-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm font-medium text-slate-300">
                <Sparkles className="size-4" />
                AI-Powered Customer Research Analysis
              </div>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl lg:leading-[1.15]">
                Turn customer feedback into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
                  product decisions.
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
                Upload support tickets, interview transcripts, customer surveys, and documents. InsightFlow AI automatically discovers recurring pain points, customer themes, user segments, and actionable recommendations in minutes.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button as={Link} to="/demo" size="lg" className="bg-white hover:bg-slate-200 text-black border-0 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all">
                  Try Demo
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button as={Link} to="/login" variant="ghost" size="lg" className="text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/20">
                  Sign In
                </Button>
              </div>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
              <SignalPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section id="product" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-32">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">Every source, one workspace</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl leading-tight">
            Your customers already told you what's wrong. It's just spread across four tools.
          </h2>
        </div>
        <div className="relative mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {sources.map(({ icon: Icon, label, comingSoon }) => (
            <div key={label} className="group relative flex flex-col items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6 text-center backdrop-blur-md transition-all hover:bg-white/[0.05] hover:border-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              {comingSoon && (
                <div className="absolute -top-3 inset-x-0 mx-auto w-max rounded-full border border-slate-500/30 bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-slate-300 uppercase shadow-xl whitespace-nowrap">
                  COMING SOON <br/> {comingSoon}
                </div>
              )}
              <span className="flex size-14 items-center justify-center rounded-xl bg-white/10 text-slate-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:scale-110 group-hover:bg-white/20 group-hover:text-white transition-all duration-300">
                <Icon className="size-6" strokeWidth={1.8} />
              </span>
              <span className="text-sm font-medium text-slate-300 leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="relative border-t border-white/5 bg-black/40 overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-32">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">The workflow</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Three simple steps from raw feedback to product insights.
            </h2>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6">
            {steps.map(({ n, title, description, icon: Icon }) => (
              <div key={n} className="group relative">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-semibold text-slate-400">{n}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </div>
                <span className="mt-6 flex size-12 items-center justify-center rounded-xl bg-black border border-white/20 text-slate-300 shadow-xl group-hover:border-white/40 group-hover:text-white transition-all duration-300">
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-32 border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What InsightFlow delivers
          </h2>
          <p className="mt-4 text-base text-slate-400">Everything you need to confidently answer: "What do our users actually want?"</p>
        </div>

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-md transition-all hover:bg-white/[0.05] hover:border-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <span className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-slate-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pb-32">
        <div className="relative text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Coming Soon</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 opacity-60">
          {comingSoon.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-transparent p-6 text-center">
              <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-white/5 text-slate-400">
                <Icon className="size-4" strokeWidth={1.8} />
              </span>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="text-[13px] leading-relaxed text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 pb-32">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black px-6 py-20 text-center sm:px-16 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-white/[0.02] to-transparent pointer-events-none" />
          
          <div className="relative flex flex-col items-center gap-8">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Stop guessing what your customers meant.
            </h2>
            <p className="max-w-lg text-base text-slate-400">
              Upload your first batch of interviews or tickets and see your first report in minutes.
            </p>
            <Button as={Link} to="/demo" size="lg" className="mt-4 bg-white text-black hover:bg-slate-200 border-0 shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all px-8">
              Try Demo
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
