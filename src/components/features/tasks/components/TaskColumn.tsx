import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { TaskStatus } from '@/types'

type TaskColumnProps = {
  status: TaskStatus
  count: number
  children: ReactNode
  className?: string
}

export function TaskColumn({ status, count, children, className }: TaskColumnProps) {
  return (
    <section
      className={cn('flex min-w-0 flex-col rounded-lg bg-slate-50/60', className)}
    >
      <header className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-700">{status}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 shadow-sm">
          {count}
        </span>
      </header>
      <div className="flex flex-1 flex-col gap-3 p-3 pt-0">{children}</div>
    </section>
  )
}
