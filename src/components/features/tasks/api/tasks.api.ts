import { apiFetch } from '@/lib/api-client'
import type { Assignee, Paginated, Task, TaskListQuery } from '@/types'

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>

export function fetchTasks(query: TaskListQuery) {
  return apiFetch<Paginated<Task>>('/tasks', {
    params: {
      q: query.q,
      priority: query.priority,
      status: query.status,
      page: query.page,
      limit: query.limit,
    },
  })
}

export function fetchTask(id: string) {
  return apiFetch<Task>(`/tasks/${id}`)
}

export function createTask(input: CreateTaskInput) {
  return apiFetch<Task>('/tasks', { method: 'POST', body: input })
}

export function updateTask(id: string, input: UpdateTaskInput) {
  return apiFetch<Task>(`/tasks/${id}`, { method: 'PATCH', body: input })
}

export function deleteTask(id: string) {
  return apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' })
}

export function fetchUsers() {
  return apiFetch<Assignee[]>('/users')
}
