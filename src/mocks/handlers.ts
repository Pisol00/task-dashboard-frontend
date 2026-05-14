import { http, HttpResponse } from 'msw'
import type { Priority, Task, TaskStatus } from '@/types'
import { db } from './db'

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),

  http.get('/api/users', () => HttpResponse.json(db.listUsers())),

  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url)
    const result = db.listTasks({
      q: url.searchParams.get('q') ?? undefined,
      priority: (url.searchParams.get('priority') as Priority | 'All' | null) ?? undefined,
      status: (url.searchParams.get('status') as TaskStatus | 'All' | null) ?? undefined,
      page: parsePositiveInt(url.searchParams.get('page'), 1),
      limit: parsePositiveInt(url.searchParams.get('limit'), 6),
    })
    return HttpResponse.json(result)
  }),

  http.get('/api/tasks/:id', ({ params }) => {
    const task = db.getTask(String(params.id))
    if (!task) return HttpResponse.json({ message: 'Task not found' }, { status: 404 })
    return HttpResponse.json(task)
  }),

  http.post('/api/tasks', async ({ request }) => {
    const body = (await request.json()) as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
    const created = db.createTask(body)
    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const patch = (await request.json()) as Partial<Task>
    const updated = db.updateTask(String(params.id), patch)
    if (!updated) return HttpResponse.json({ message: 'Task not found' }, { status: 404 })
    return HttpResponse.json(updated)
  }),

  http.delete('/api/tasks/:id', ({ params }) => {
    const ok = db.deleteTask(String(params.id))
    if (!ok) return HttpResponse.json({ message: 'Task not found' }, { status: 404 })
    return new HttpResponse(null, { status: 204 })
  }),
]
