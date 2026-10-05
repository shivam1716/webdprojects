import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-accent text-ink-on-accent shadow-flat hover:bg-accent-hover active:bg-accent-active disabled:bg-accent/50',
  secondary:
    'bg-surface text-ink border border-border hover:bg-sunken active:bg-border/40 shadow-flat',
  ghost:
    'bg-transparent text-ink-soft hover:bg-sunken hover:text-ink',
  danger:
    'bg-danger text-white hover:bg-red-700 active:bg-red-800 shadow-flat',
  link:
    'bg-transparent text-accent hover:text-accent-hover px-0 h-auto',
}

const sizes = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-lg',
  md: 'h-9 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-5 text-[15px] gap-2 rounded-xl',
}

/**
 * Button — the single interactive control used across the app.
 * variant: primary | secondary | ghost | danger | link
 * size: sm | md | lg
 */
const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    className,
    children,
    disabled,
    ...props
  },
  ref
) {
  return (
    <Component
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variant !== 'link' && sizes[size],
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" strokeWidth={2.25} />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="size-4" strokeWidth={2.25} />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="size-4" strokeWidth={2.25} />}
    </Component>
  )
})

export default Button
