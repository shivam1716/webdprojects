import { cn } from '../../utils/cn'

export default function ProgressBar({ value = 0, tone = 'accent', className, showLabel = false }) {
  const toneMap = {
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }
  return (
    <div className={cn('w-full', className)}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sunken">
        <div
          className={cn('h-full rounded-full transition-all duration-300', toneMap[tone])}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && <div className="mt-1 text-right font-mono text-[11px] text-ink-faint">{value}%</div>}
    </div>
  )
}
