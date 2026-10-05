import { cn } from '../../utils/cn'

const sizeMap = {
  sm: { height: 'h-3.5', width: 'w-0.5', gap: 'gap-0.5' },
  md: { height: 'h-5', width: 'w-[3px]', gap: 'gap-1' },
  lg: { height: 'h-8', width: 'w-1', gap: 'gap-1.5' },
}

const delays = ['0ms', '120ms', '240ms', '120ms', '0ms']

/**
 * LoadingSpinner — five bars pulsing like an audio waveform, echoing the
 * brand mark. Used anywhere content is being analyzed or fetched.
 */
export default function LoadingSpinner({ size = 'md', label, className }) {
  const s = sizeMap[size]
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)} role="status" aria-label={label || 'Loading'}>
      <div className={cn('flex items-end', s.gap)}>
        {delays.map((delay, i) => (
          <span
            key={i}
            className={cn('rounded-full bg-accent animate-pulse-line', s.height, s.width)}
            style={{ animationDelay: delay }}
          />
        ))}
      </div>
      {label && <span className="text-sm text-ink-soft">{label}</span>}
    </div>
  )
}
