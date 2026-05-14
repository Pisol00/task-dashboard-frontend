import { Calendar, Pencil, Trash2 } from 'lucide-react'
import { AvatarStack, Badge, Button, Dialog, ProgressBar } from '@/components/ui'
import { PRIORITY_LABELS } from '@/constants'
import type { Task } from '@/types'
import { formatDate } from '../utils/format'
import { PRIORITY_TONE, PROGRESS_BAR_TONE, STATUS_TONE, TAG_TONE } from '../utils/tone'

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
              <Button variant="ghost" onClick={() => onDelete(task)} className="text-rose-600">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={() => onEdit(task)}>
                <Pencil className="h-4 w-4" />
                Update
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={TAG_TONE[task.tag]}>{task.tag}</Badge>
          <Badge tone={PRIORITY_TONE[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
          <Badge tone={STATUS_TONE[task.status]}>{task.status}</Badge>
        </div>

        {task.description && (
          <div className="space-y-1">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Description
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">{task.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Due date">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          </Field>

          <Field label="Status">
            <Badge tone={STATUS_TONE[task.status]}>{task.status}</Badge>
          </Field>
        </div>

        <Field label="Progress">
          <div className="flex items-center gap-3">
            <ProgressBar
              value={task.progress}
              barClassName={PROGRESS_BAR_TONE[task.status]}
              className="flex-1"
            />
            <span className="text-sm font-semibold text-slate-700">{task.progress}%</span>
          </div>
        </Field>

        <Field label={`Assignees (${task.assignees.length})`}>
          {task.assignees.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              <AvatarStack users={task.assignees} max={5} size="md" />
              <span className="text-sm text-slate-600">
                {task.assignees.map((a) => a.name).join(', ')}
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No one assigned</p>
          )}
        </Field>
      </div>
    </Dialog>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</h3>
      {children}
    </div>
  )
}
