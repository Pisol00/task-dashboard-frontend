import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: string
}

export function Badge({ tone, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        tone ?? 'bg-[var(--surface-muted)] text-secondary',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
