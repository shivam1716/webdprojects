import { Search } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function SearchBar({ value, onChange, placeholder = 'Search...', className, shortcut }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" strokeWidth={2} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-xl border border-border bg-surface pl-10 text-[13px] text-ink placeholder:text-ink-faint shadow-flat',
          shortcut ? 'pr-12' : 'pr-3',
          'transition-shadow duration-200 focus:outline-none focus:ring-4 focus:ring-accent-soft focus:border-accent'
        )}
      />
      {shortcut && (
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border-strong bg-sunken px-1.5 py-0.5 font-mono text-[11px] text-ink-faint">
          {shortcut}
        </kbd>
      )}
    </div>
  )
}
