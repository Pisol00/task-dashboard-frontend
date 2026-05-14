import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { TaskStatus } from '@/types'

type TaskColumnProps = {
  status: TaskStatus
  count: number
  children: ReactNode
  className?: string
}

const STATUS_KEY: Record<TaskStatus, string> = {
  'To Do': 'board.todo',
  'In Progress': 'board.inProgress',
  Done: 'board.done',
}

export function TaskColumn({ status, count, children, className }: TaskColumnProps) {
  const { t } = useTranslation()

  return (
    <section
      className={cn(
        'flex min-w-0 flex-col rounded-lg bg-slate-50/60 dark:bg-slate-800/50',
        className,
      )}
    >
      <header className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t(STATUS_KEY[status])}
        </h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-700 dark:text-slate-300">
          {count}
        </span>
      </header>
      <div className="flex flex-1 flex-col gap-3 p-3 pt-0">{children}</div>
    </section>
  )
}
