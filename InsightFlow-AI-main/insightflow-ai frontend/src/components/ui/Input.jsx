import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Label = ({ className, children, ...props }) => (
  <label className={cn('block text-[13px] font-medium text-ink mb-1.5', className)} {...props}>
    {children}
  </label>
)

const Input = forwardRef(function Input({ className, icon: Icon, error, ...props }, ref) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" strokeWidth={2} />
      )}
      <input
        ref={ref}
        className={cn(
          'w-full h-10 rounded-xl border bg-surface px-3.5 text-sm text-ink placeholder:text-ink-faint shadow-flat',
          'border-border transition-shadow duration-200',
          'focus:outline-none focus:ring-4 focus:ring-accent-soft focus:border-accent',
          Icon && 'pl-9',
          error && 'border-danger focus:ring-danger-soft focus:border-danger',
          className
        )}
        {...props}
      />
    </div>
  )
})

export default Input
