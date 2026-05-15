import type { Priority, TaskStatus, TaskTag } from '@/types'

export const TASK_STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Done']
export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']
export const TASK_TAGS: TaskTag[] = ['Feature', 'Bug', 'Chore', 'Docs']

export const PRIORITY_LABELS: Record<Priority, string> = {
  Low: 'Low',
  Medium: 'Medium Priority',
  High: 'High Priority',
}
