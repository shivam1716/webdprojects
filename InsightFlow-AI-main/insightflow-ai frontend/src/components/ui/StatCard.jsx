import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import Card from './Card'

export default function StatCard({ label, value, delta, trend = 'up', icon: Icon, className }) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown
  return (
    <Card padding="p-5" className={cn('flex flex-col gap-3.5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-soft">{label}</span>
        {Icon && (
          <span className="flex size-8 items-center justify-center rounded-md bg-accent-soft text-accent">
            <Icon className="size-4" strokeWidth={2.1} />
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="font-mono text-[28px] font-semibold leading-none tracking-tight text-ink tabular">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trend === 'up' ? 'text-success' : 'text-danger'
            )}
          >
            <TrendIcon className="size-3.5" strokeWidth={2.3} />
            {delta}
          </span>
        )}
      </div>
    </Card>
  )
}
