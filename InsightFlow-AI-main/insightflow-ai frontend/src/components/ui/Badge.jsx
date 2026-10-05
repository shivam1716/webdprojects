import { cn } from '../../utils/cn'

const tones = {
  neutral: 'bg-sunken text-ink-soft border-transparent',
  accent: 'bg-accent-soft text-accent-active border-transparent',
  success: 'bg-success-soft text-success border-transparent',
  warning: 'bg-warning-soft text-warning border-transparent',
  danger: 'bg-danger-soft text-danger border-transparent',
  violet: 'bg-violet-soft text-violet border-transparent',
  outline: 'bg-transparent text-ink-soft border-border-strong',
}

const dotTones = {
  neutral: 'bg-ink-faint',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  violet: 'bg-violet',
  outline: 'bg-ink-faint',
}

export default function Badge({ tone = 'neutral', dot = false, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium leading-none',
        tones[tone],
        className
      )}
    >
      {dot && <span className={cn('size-1.5 rounded-full', dotTones[tone])} />}
      {children}
    </span>
  )
}

// Maps common status strings to a sensible tone automatically.
export function statusTone(status) {
  const map = {
    Active: 'success',
    'In review': 'warning',
    'Analysis Pending': 'neutral',
    'Analysis Not Run': 'warning',
    Completed: 'accent',
    Archived: 'neutral',
    Processed: 'success',
    Processing: 'warning',
    Queued: 'neutral',
    Failed: 'danger',
    High: 'danger',
    Medium: 'warning',
    Low: 'neutral',
  }
  return map[status] || 'neutral'
}
