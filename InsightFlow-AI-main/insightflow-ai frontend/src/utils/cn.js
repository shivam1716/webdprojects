import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * cn('p-4', condition && 'p-6') -> 'p-6'
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
