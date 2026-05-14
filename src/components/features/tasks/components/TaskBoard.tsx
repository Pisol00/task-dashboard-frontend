import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TASK_STATUSES } from '@/constants'
import type { Task, TaskStatus } from '@/types'
import { TaskCard } from './TaskCard'
import { TaskColumn } from './TaskColumn'

type TaskBoardProps = {
  tasks: Task[]
  onCardClick?: (task: Task) => void
}

export function TaskBoard({ tasks, onCardClick }: TaskBoardProps) {
  const { t } = useTranslation()

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
    <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const columnTasks = grouped[status]
        return (
          <TaskColumn key={status} status={status} count={columnTasks.length}>
            {columnTasks.length === 0 ? (
              <div className="border-subtle text-subtle flex flex-1 items-center justify-center rounded-xl border border-dashed bg-[var(--surface-base)]/40 p-6 text-center text-xs">
                {t('board.noTasks')}
              </div>
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
