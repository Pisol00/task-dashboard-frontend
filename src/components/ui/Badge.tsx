import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: string
}

export function Badge({ tone, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        tone ?? 'bg-slate-100 text-slate-700',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
