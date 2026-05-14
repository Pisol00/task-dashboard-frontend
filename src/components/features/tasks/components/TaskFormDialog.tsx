import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Combobox,
  Dialog,
  Input,
  Textarea,
  type ComboboxOption,
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

const TAG_OPTIONS: ComboboxOption<TaskTag>[] = TASK_TAGS.map((t) => ({ value: t, label: t }))
const PRIORITY_OPTIONS: ComboboxOption<Priority>[] = PRIORITIES.map((p) => ({
  value: p,
  label: p,
}))
const STATUS_OPTIONS: ComboboxOption<TaskStatus>[] = TASK_STATUSES.map((s) => ({
  value: s,
  label: s,
}))

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
  const { t } = useTranslation()
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
    if (!form.title.trim()) next.title = t('task.errors.titleRequired')
    if (form.progress < 0 || form.progress > 100) next.progress = t('task.errors.progressRange')
    if (!form.dueDate) next.dueDate = t('task.errors.dueDateRequired')
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
      title={mode === 'create' ? t('dialogs.createTitle') : t('dialogs.editTitle')}
      description={
        mode === 'create' ? t('dialogs.createDescription') : t('dialogs.editDescription')
      }
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="task-form" disabled={isSubmitting}>
            {isSubmitting
              ? t('common.saving')
              : mode === 'create'
                ? t('common.create')
                : t('common.saveChanges')}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('task.title')}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={errors.title}
          placeholder={t('task.titlePlaceholder')}
          autoFocus
        />

        <Textarea
          label={t('task.description')}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder={t('task.descriptionPlaceholder')}
          rows={3}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Combobox<TaskTag>
            label={t('task.tag')}
            value={form.tag}
            onChange={(v) => set('tag', v)}
            options={TAG_OPTIONS}
          />
          <Combobox<Priority>
            label={t('task.priority')}
            value={form.priority}
            onChange={(v) => set('priority', v)}
            options={PRIORITY_OPTIONS}
          />
          <Combobox<TaskStatus>
            label={t('task.status')}
            value={form.status}
            onChange={(v) => set('status', v)}
            options={STATUS_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t('task.dueDate')}
            type="date"
            value={form.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
            error={errors.dueDate}
          />
          <Input
            label={t('task.progressLabel')}
            type="number"
            min={0}
            max={100}
            value={form.progress}
            onChange={(e) => set('progress', Number(e.target.value))}
            error={errors.progress}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary">{t('task.assignees')}</label>
          <div className="border-subtle grid grid-cols-1 gap-1 rounded-lg border p-2 sm:grid-cols-2">
            {users?.map((user) => {
              const checked = form.assigneeIds.includes(user.id)
              return (
                <label
                  key={user.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors duration-150',
                    checked
                      ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                      : 'text-secondary hover:bg-[var(--surface-muted)]',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAssignee(user.id)}
                    className="border-subtle h-4 w-4 cursor-pointer rounded text-brand-600 focus:ring-brand-500"
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
