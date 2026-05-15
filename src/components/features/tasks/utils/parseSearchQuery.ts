import type { Priority, TaskStatus, TaskTag } from '@/types'

type ParsedSearchQuery = {
  q?: string
  priority?: Priority
  status?: TaskStatus
  tag?: TaskTag
}

const TAG_ALIASES: Record<string, TaskTag> = {
  feature: 'Feature',
  feat: 'Feature',
  'ฟีเจอร์': 'Feature',
  bug: 'Bug',
  'บั๊ก': 'Bug',
  chore: 'Chore',
  'งานทั่วไป': 'Chore',
  docs: 'Docs',
  doc: 'Docs',
  documentation: 'Docs',
  'เอกสาร': 'Docs',
}

const PRIORITY_ALIASES: Record<string, Priority> = {
  low: 'Low',
  'ต่ำ': 'Low',
  medium: 'Medium',
  med: 'Medium',
  'กลาง': 'Medium',
  'ปานกลาง': 'Medium',
  high: 'High',
  'สูง': 'High',
}

const STATUS_ALIASES: Record<string, TaskStatus> = {
  'to do': 'To Do',
  todo: 'To Do',
  'รอดำเนินการ': 'To Do',
  'รอ': 'To Do',
  'in progress': 'In Progress',
  inprogress: 'In Progress',
  progress: 'In Progress',
  'กำลังทำ': 'In Progress',
  'กำลัง': 'In Progress',
  done: 'Done',
  'เสร็จ': 'Done',
  'เสร็จสิ้น': 'Done',
}

/**
 * Smart parser: detects if user typed a priority or status keyword.
 * Falls back to treating the whole input as a title query.
 */
export function parseSearchQuery(input: string): ParsedSearchQuery {
  const trimmed = input.trim()
  if (!trimmed) return {}

  const key = trimmed.toLowerCase()
  if (PRIORITY_ALIASES[key]) return { priority: PRIORITY_ALIASES[key] }
  if (STATUS_ALIASES[key]) return { status: STATUS_ALIASES[key] }
  if (TAG_ALIASES[key]) return { tag: TAG_ALIASES[key] }

  return { q: trimmed }
}
