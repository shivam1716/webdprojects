import { cn } from '../../utils/cn'

/**
 * Card — flat surface with a hairline border. Shadow only appears on hover
 * when `interactive` is set, keeping the resting UI calm and flat.
 */
export default function Card({ className, interactive = false, padding = 'p-6', children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-2xl',
        padding,
        interactive && 'transition-shadow duration-200 hover:border-border-strong hover:shadow-raised cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-[14px] font-semibold text-ink tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm text-ink-soft mt-1', className)} {...props}>
      {children}
    </p>
  )
}
