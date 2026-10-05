import { cn } from '../../utils/cn'
import Button from './Button'

function SignalIllustration() {
  return (
    <svg width="88" height="56" viewBox="0 0 88 56" fill="none" className="text-border-strong">
      <path
        d="M2 28H20L26 20L32 36L38 12L44 44L50 28H86"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="44" r="3.5" fill="var(--color-accent)" />
    </svg>
  )
}

/**
 * EmptyState — treats emptiness as an invitation to act, not a dead end.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className,
  compact = false,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-canvas text-center',
        compact ? 'p-8' : 'p-14',
        className
      )}
    >
      {Icon ? (
        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-surface border border-border shadow-flat text-ink-faint">
          <Icon className="size-5" strokeWidth={1.8} />
        </span>
      ) : (
        <div className="mb-4">
          <SignalIllustration />
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{description}</p>}
      {actionLabel && (
        <Button size="sm" icon={actionIcon} onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
