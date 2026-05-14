import { useEffect, useState, type FormEvent } from 'react'
import {
  Button,
  Dialog,
  Input,
  Select,
  Textarea,
  type SelectOption,
} from '@/components/ui'
import { PRIORITIES, TASK_STATUSES, TASK_TAGS } from '@/constants'
import { cn } from '@/lib/utils'
import type { Assignee, Priority, Task, TaskStatus, TaskTag } from '@/types'
import type { CreateTaskInput } from '../api/tasks.api'
import { useUsers } from '../api/useUsersQuery'

type TaskFormDialogProps = {
  open: boolean
  onClose: () => void
  task?: Task | null
  onSubmit: (input: CreateTaskInput) => void | Promise<void>
  isSubmitting?: boolean
}

type FormState = {
  title: string
  description: string
  tag: TaskTag
  priority: Priority
  status: TaskStatus
  progress: number
  dueDate: string
  assigneeIds: string[]
}

const TAG_OPTIONS: SelectOption[] = TASK_TAGS.map((t) => ({ value: t, label: t }))
const PRIORITY_OPTIONS: SelectOption[] = PRIORITIES.map((p) => ({ value: p, label: p }))
const STATUS_OPTIONS: SelectOption[] = TASK_STATUSES.map((s) => ({ value: s, label: s }))

function emptyForm(): FormState {
  const today = new Date().toISOString().slice(0, 10)
  return {
    title: '',
    description: '',
    tag: 'Feature',
    priority: 'Medium',
    status: 'To Do',
    progress: 0,
    dueDate: today,
    assigneeIds: [],
  }
}

function fromTask(task: Task): FormState {
  return {
    title: task.title,
    description: task.description ?? '',
    tag: task.tag,
    priority: task.priority,
    status: task.status,
    progress: task.progress,
    dueDate: task.dueDate.slice(0, 10),
    assigneeIds: task.assignees.map((a) => a.id),
  }
}

export function TaskFormDialog({
  open,
  onClose,
  task,
  onSubmit,
  isSubmitting,
}: TaskFormDialogProps) {
  const mode = task ? 'edit' : 'create'
  const [form, setForm] = useState<FormState>(() => (task ? fromTask(task) : emptyForm()))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const { data: users } = useUsers()

  useEffect(() => {
    if (open) {
      setForm(task ? fromTask(task) : emptyForm())
      setErrors({})
    }
  }, [open, task])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleAssignee = (id: string) => {
    setForm((prev) => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(id)
        ? prev.assigneeIds.filter((x) => x !== id)
        : [...prev.assigneeIds, id],
    }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (form.progress < 0 || form.progress > 100) next.progress = 'Progress must be 0–100'
    if (!form.dueDate) next.dueDate = 'Due date is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const assignees: Assignee[] =
      users?.filter((u) => form.assigneeIds.includes(u.id)) ?? []

    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      tag: form.tag,
      priority: form.priority,
      status: form.status,
      progress: form.progress,
      dueDate: form.dueDate,
      assignees,
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Create new task' : 'Update task'}
      description={
        mode === 'create' ? 'Add a new task to the board.' : 'Edit task details and save.'
      }
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="task-form" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={errors.title}
          placeholder="e.g. Implement dark mode"
          autoFocus
        />

        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Optional details"
          rows={3}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Tag"
            value={form.tag}
            onChange={(e) => set('tag', e.target.value as TaskTag)}
            options={TAG_OPTIONS}
          />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => set('priority', e.target.value as Priority)}
            options={PRIORITY_OPTIONS}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => set('status', e.target.value as TaskStatus)}
            options={STATUS_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
            error={errors.dueDate}
          />
          <Input
            label="Progress (%)"
            type="number"
            min={0}
            max={100}
            value={form.progress}
            onChange={(e) => set('progress', Number(e.target.value))}
            error={errors.progress}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Assignees</label>
          <div className="grid grid-cols-1 gap-2 rounded-md border border-slate-200 p-3 sm:grid-cols-2">
            {users?.map((user) => {
              const checked = form.assigneeIds.includes(user.id)
              return (
                <label
                  key={user.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                    checked ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAssignee(user.id)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{user.name}</span>
                </label>
              )
            })}
          </div>
        </div>
      </form>
    </Dialog>
  )
}
