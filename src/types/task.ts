export type TaskTag = 'Feature' | 'Bug' | 'Chore' | 'Docs'
export type Priority = 'Low' | 'Medium' | 'High'
export type TaskStatus = 'To Do' | 'In Progress' | 'Done'

export type Assignee = {
  id: string
  name: string
  avatarUrl?: string
}

export type Task = {
  id: string
  title: string
  description?: string
  tag: TaskTag
  priority: Priority
  status: TaskStatus
  progress: number
  dueDate: string
  assignees: Assignee[]
  createdAt: string
  updatedAt: string
}

export type TaskListQuery = {
  q?: string
  priority?: Priority | 'All'
  status?: TaskStatus | 'All'
  page?: number
  limit?: number
}

export type Paginated<T> = {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}
