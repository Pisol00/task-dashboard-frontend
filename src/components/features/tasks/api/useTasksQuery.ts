import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import type { TaskListQuery } from '@/types'
import { fetchTask, fetchTasks } from './tasks.api'

export function useTasks(query: TaskListQuery) {
  return useQuery({
    queryKey: queryKeys.tasks.list(query),
    queryFn: () => fetchTasks(query),
    placeholderData: (prev) => prev,
  })
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id ?? ''),
    queryFn: () => fetchTask(id as string),
    enabled: Boolean(id),
  })
}
