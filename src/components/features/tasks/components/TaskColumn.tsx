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
      className={cn('surface-sunken flex min-w-0 flex-col rounded-2xl', className)}
    >
      <header className="flex items-center justify-between px-5 py-4">
        <h3 className="text-sm font-semibold text-secondary">{t(STATUS_KEY[status])}</h3>
        <span className="surface-base border-subtle rounded-full border px-2.5 py-0.5 text-xs font-medium text-secondary">
          {count}
        </span>
      </header>
      <div className="flex flex-1 flex-col gap-3 px-3 pb-3">{children}</div>
    </section>
  )
}
