import type { Priority, TaskStatus, TaskTag } from '@/types'

export const PRIORITY_TONE: Record<Priority, string> = {
  Low: 'bg-[var(--surface-muted)] text-muted',
  Medium: 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500',
  High: 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-500',
}

export const STATUS_TONE: Record<TaskStatus, string> = {
  'To Do': 'bg-[var(--surface-muted)] text-secondary',
  'In Progress': 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500',
  Done: 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500',
}

export const TAG_TONE: Record<TaskTag, string> = {
  Feature: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  Bug: 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-500',
  Chore: 'bg-[var(--surface-muted)] text-secondary',
  Docs: 'bg-info-100 text-info-700 dark:bg-info-500/15 dark:text-info-500',
}

export const PROGRESS_BAR_TONE: Record<TaskStatus, string> = {
  'To Do': 'bg-[var(--border-default)]',
  'In Progress': 'bg-warning-500',
  Done: 'bg-success-500',
}
