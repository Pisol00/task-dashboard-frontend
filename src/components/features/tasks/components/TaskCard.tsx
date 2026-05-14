import { Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AvatarStack, Badge, ProgressBar } from '@/components/ui'
import { PRIORITY_LABELS } from '@/constants'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'
import { formatDate } from '../utils/format'
import { PRIORITY_TONE, PROGRESS_BAR_TONE, STATUS_TONE, TAG_TONE } from '../utils/tone'

type TaskCardProps = {
  task: Task
  onClick?: (task: Task) => void
  className?: string
}

const STATUS_KEY = {
  'To Do': 'board.todo',
  'In Progress': 'board.inProgress',
  Done: 'board.done',
} as const

export function TaskCard({ task, onClick, className }: TaskCardProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={() => onClick?.(task)}
      className={cn(
        'group surface-base border-subtle flex w-full cursor-pointer flex-col gap-3 rounded-xl border p-5 text-left shadow-xs transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-brand',
        className,
      )}
    >
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-primary transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-300">
          {task.title}
        </h3>
        <p className="text-xs text-muted">Web App Redesign</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={TAG_TONE[task.tag]}>{task.tag}</Badge>
        <Badge tone={PRIORITY_TONE[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted">
        <Calendar className="h-3.5 w-3.5" />
        <span>{formatDate(task.dueDate)}</span>
        <Badge tone={STATUS_TONE[task.status]} className="ml-1">
          {t(STATUS_KEY[task.status])}
        </Badge>
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">{t('task.progress')}</span>
          <span className="text-xs font-semibold text-secondary">{task.progress}%</span>
        </div>
        <div className="flex items-center gap-3">
          <ProgressBar
            value={task.progress}
            barClassName={PROGRESS_BAR_TONE[task.status]}
            className="flex-1"
          />
          {task.assignees.length > 0 && <AvatarStack users={task.assignees} max={3} size="sm" />}
        </div>
      </div>
    </button>
  )
}
