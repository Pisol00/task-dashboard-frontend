import { Calendar, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AvatarStack, Badge, Button, Dialog, ProgressBar } from '@/components/ui'
import { PRIORITY_LABELS } from '@/constants'
import type { Task, TaskStatus } from '@/types'
import { formatDate } from '../utils/format'
import { PRIORITY_TONE, PROGRESS_BAR_TONE, STATUS_TONE, TAG_TONE } from '../utils/tone'

const STATUS_KEY: Record<TaskStatus, string> = {
  'To Do': 'board.todo',
  'In Progress': 'board.inProgress',
  Done: 'board.done',
}

type TaskDetailDialogProps = {
  task: Task | null
  open: boolean
  onClose: () => void
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

export function TaskDetailDialog({
  task,
  open,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailDialogProps) {
  const { t } = useTranslation()

  if (!task) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={task.title}
      description="Web App Redesign"
      size="md"
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <div>
            {onDelete && (
              <Button
                variant="ghost"
                onClick={() => onDelete(task)}
                className="text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10"
              >
                <Trash2 className="h-4 w-4" />
                {t('common.delete')}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              {t('common.close')}
            </Button>
            {onEdit && <Button onClick={() => onEdit(task)}>{t('common.update')}</Button>}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={TAG_TONE[task.tag]}>{task.tag}</Badge>
          <Badge tone={PRIORITY_TONE[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
          <Badge tone={STATUS_TONE[task.status]}>{t(STATUS_KEY[task.status])}</Badge>
        </div>

        {task.description && (
          <div className="space-y-1.5">
            <h3 className="text-subtle text-xs font-semibold tracking-wide uppercase">
              {t('task.description')}
            </h3>
            <p className="text-sm leading-relaxed text-secondary">{task.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label={t('task.dueDate')}>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <Calendar className="text-subtle h-4 w-4" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          </Field>

          <Field label={t('task.status')}>
            <Badge tone={STATUS_TONE[task.status]}>{t(STATUS_KEY[task.status])}</Badge>
          </Field>
        </div>

        <Field label={t('task.progress')}>
          <div className="flex items-center gap-3">
            <ProgressBar
              value={task.progress}
              barClassName={PROGRESS_BAR_TONE[task.status]}
              className="flex-1"
            />
            <span className="text-sm font-semibold text-secondary">{task.progress}%</span>
          </div>
        </Field>

        <Field label={t('task.assigneesCount', { count: task.assignees.length })}>
          {task.assignees.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              <AvatarStack users={task.assignees} max={5} size="md" />
              <span className="text-sm text-secondary">
                {task.assignees.map((a) => a.name).join(', ')}
              </span>
            </div>
          ) : (
            <p className="text-sm text-subtle">{t('task.noOneAssigned')}</p>
          )}
        </Field>
      </div>
    </Dialog>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-subtle text-xs font-semibold tracking-wide uppercase">{label}</h3>
      {children}
    </div>
  )
}
