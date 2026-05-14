import type { Paginated, Task, TaskListQuery } from '@/types'
import { TASKS } from './fixtures/tasks'
import { USERS } from './fixtures/users'

let tasks: Task[] = TASKS.map((t) => ({ ...t, assignees: [...t.assignees] }))

function nextId() {
  return `t${Date.now().toString(36)}`
}

function nowIso() {
  return new Date().toISOString()
}

export const db = {
  listTasks(query: TaskListQuery = {}): Paginated<Task> {
    const { q, priority, status, page = 1, limit = 6 } = query

    const filtered = tasks.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false
      if (priority && priority !== 'All' && t.priority !== priority) return false
      if (status && status !== 'All' && t.status !== status) return false
      return true
    })

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * limit
    const data = filtered.slice(start, start + limit)

    return { data, page: safePage, limit, total, totalPages }
  },

  getTask(id: string): Task | undefined {
    return tasks.find((t) => t.id === id)
  },

  createTask(input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const created: Task = {
      ...input,
      id: nextId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    tasks = [created, ...tasks]
    return created
  },

  updateTask(id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | undefined {
    const idx = tasks.findIndex((t) => t.id === id)
    if (idx === -1) return undefined
    const updated: Task = { ...tasks[idx], ...patch, id, updatedAt: nowIso() }
    tasks = [...tasks.slice(0, idx), updated, ...tasks.slice(idx + 1)]
    return updated
  },

  deleteTask(id: string): boolean {
    const before = tasks.length
    tasks = tasks.filter((t) => t.id !== id)
    return tasks.length < before
  },

  listUsers() {
    return USERS
  },
}
