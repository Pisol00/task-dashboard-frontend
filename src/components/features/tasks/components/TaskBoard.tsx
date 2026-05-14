import { useMemo } from 'react'
import { TASK_STATUSES } from '@/constants'
import type { Task, TaskStatus } from '@/types'
import { TaskCard } from './TaskCard'
import { TaskColumn } from './TaskColumn'

type TaskBoardProps = {
  tasks: Task[]
  onCardClick?: (task: Task) => void
}

export function TaskBoard({ tasks, onCardClick }: TaskBoardProps) {
  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      'To Do': [],
      'In Progress': [],
      Done: [],
    }
    for (const task of tasks) map[task.status].push(task)
    return map
  }, [tasks])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const columnTasks = grouped[status]
        return (
          <TaskColumn key={status} status={status} count={columnTasks.length}>
            {columnTasks.length === 0 ? (
              <p className="rounded-md border border-dashed border-slate-200 bg-white/40 p-6 text-center text-xs text-slate-400">
                No tasks
              </p>
            ) : (
              columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={onCardClick} />
              ))
            )}
          </TaskColumn>
        )
      })}
    </div>
  )
}
