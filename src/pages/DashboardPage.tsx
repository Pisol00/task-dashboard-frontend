import { TaskCard } from '@/components/features/tasks/components'
import { useTasks } from '@/components/features/tasks/api'

export function DashboardPage() {
  const { data, isLoading, isError } = useTasks({ limit: 6, page: 1 })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          Loading tasks…
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-700">
          Failed to load tasks
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={(t) => console.log('clicked', t.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
