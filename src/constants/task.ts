import type { Priority, TaskStatus, TaskTag } from '@/types'

export const TASK_STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Done']
export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']
export const TASK_TAGS: TaskTag[] = ['Feature', 'Bug', 'Chore', 'Docs']

export const PRIORITY_LABELS: Record<Priority, string> = {
  Low: 'Low',
  Medium: 'Medium Priority',
  High: 'High Priority',
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  'To Do': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Done: 'bg-emerald-100 text-emerald-700',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700',
}

export const DEFAULT_PAGE_SIZE = 6
