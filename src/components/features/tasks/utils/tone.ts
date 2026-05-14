import type { Priority, TaskStatus, TaskTag } from '@/types'

export const PRIORITY_TONE: Record<Priority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700',
}

export const STATUS_TONE: Record<TaskStatus, string> = {
  'To Do': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Done: 'bg-emerald-100 text-emerald-700',
}

export const TAG_TONE: Record<TaskTag, string> = {
  Feature: 'bg-indigo-100 text-indigo-700',
  Bug: 'bg-rose-100 text-rose-700',
  Chore: 'bg-slate-100 text-slate-700',
  Docs: 'bg-sky-100 text-sky-700',
}

export const PROGRESS_BAR_TONE: Record<TaskStatus, string> = {
  'To Do': 'bg-slate-400',
  'In Progress': 'bg-amber-500',
  Done: 'bg-emerald-500',
}
