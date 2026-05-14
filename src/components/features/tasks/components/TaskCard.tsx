import { Calendar } from 'lucide-react'
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

export function TaskCard({ task, onClick, className }: TaskCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(task)}
      className={cn(
        'group flex w-full flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition-all',
        'hover:border-indigo-300 hover:shadow-md',
        'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
        className,
      )}
    >
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
          {task.title}
        </h3>
        <p className="text-xs text-slate-500">Web App Redesign</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={TAG_TONE[task.tag]}>{task.tag}</Badge>
        <Badge tone={PRIORITY_TONE[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Calendar className="h-3.5 w-3.5" />
        <span>{formatDate(task.dueDate)}</span>
        <Badge tone={STATUS_TONE[task.status]} className="ml-1">
          {task.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Progress</span>
          <span className="text-xs font-semibold text-slate-700">{task.progress}%</span>
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
