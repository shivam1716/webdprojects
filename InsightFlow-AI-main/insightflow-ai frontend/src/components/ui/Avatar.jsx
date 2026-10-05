import { cn } from '../../utils/cn'

const palette = ['#2F5EFF', '#6E56CF', '#12875A', '#B25E09', '#C4293D']

function hashName(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash) % palette.length
}

const sizes = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-9 text-[13px]',
  lg: 'size-12 text-base',
}

export default function Avatar({ name = '', size = 'md', className }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        sizes[size],
        className
      )}
      style={{ backgroundColor: palette[hashName(name)] }}
    >
      {initials || '?'}
    </span>
  )
}
