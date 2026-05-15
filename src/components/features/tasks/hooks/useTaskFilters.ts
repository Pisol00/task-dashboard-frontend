import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { PRIORITIES, TASK_STATUSES, TASK_TAGS } from '@/constants'
import type { Priority, TaskListQuery, TaskStatus, TaskTag } from '@/types'

type FilterUpdate = {
  q?: string
  priority?: Priority | 'All'
  status?: TaskStatus | 'All'
  tag?: TaskTag | 'All'
  page?: number
}

function parsePriority(value: string | null): Priority | 'All' {
  if (value && (PRIORITIES as string[]).includes(value)) return value as Priority
  return 'All'
}

function parseStatus(value: string | null): TaskStatus | 'All' {
  if (value && (TASK_STATUSES as string[]).includes(value)) return value as TaskStatus
  return 'All'
}

function parseTag(value: string | null): TaskTag | 'All' {
  if (value && (TASK_TAGS as string[]).includes(value)) return value as TaskTag
  return 'All'
}

function parsePage(value: string | null): number {
  if (!value) return 1
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
}

export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const navSearchActive = searchParams.get('navSearch') === '1'

  const rawFilters = useMemo(
    () => ({
      q: searchParams.get('q') ?? '',
      priority: parsePriority(searchParams.get('priority')),
      status: parseStatus(searchParams.get('status')),
      tag: parseTag(searchParams.get('tag')),
      page: parsePage(searchParams.get('page')),
    }),
    [searchParams],
  )

  // Displayed filters: hide values from the Dashboard filter bar while
  // a nav-search session is active so the two inputs don't visually sync.
  const filters = useMemo(
    () =>
      navSearchActive
        ? { q: '', priority: 'All' as const, status: 'All' as const, tag: 'All' as const, page: rawFilters.page }
        : rawFilters,
    [navSearchActive, rawFilters],
  )

  const setFilters = useCallback(
    (update: FilterUpdate, options: { resetPage?: boolean } = {}) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const writes: Array<[string, string | undefined]> = []

          if ('q' in update) writes.push(['q', update.q || undefined])
          if ('priority' in update)
            writes.push(['priority', update.priority === 'All' ? undefined : update.priority])
          if ('status' in update)
            writes.push(['status', update.status === 'All' ? undefined : update.status])
          if ('tag' in update)
            writes.push(['tag', update.tag === 'All' ? undefined : update.tag])
          if ('page' in update)
            writes.push(['page', update.page && update.page > 1 ? String(update.page) : undefined])

          for (const [key, value] of writes) {
            if (value === undefined || value === '') next.delete(key)
            else next.set(key, value)
          }

          const touchedFilter =
            'q' in update || 'priority' in update || 'status' in update || 'tag' in update
          if (touchedFilter) {
            // Filter changes from Dashboard always supersede a nav-search session.
            next.delete('navSearch')
            if (options.resetPage !== false && !('page' in update)) {
              next.delete('page')
            }
          }

          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const clear = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  // Query uses the raw URL values — so the board still filters correctly
  // while a nav-search session is active.
  const query: TaskListQuery = useMemo(
    () => ({
      q: rawFilters.q || undefined,
      priority: rawFilters.priority,
      status: rawFilters.status,
      tag: rawFilters.tag,
      page: rawFilters.page,
    }),
    [rawFilters],
  )

  const isActive =
    !navSearchActive &&
    (Boolean(filters.q) ||
      filters.priority !== 'All' ||
      filters.status !== 'All' ||
      filters.tag !== 'All')

  return { filters, query, setFilters, clear, isActive, navSearchActive }
}
