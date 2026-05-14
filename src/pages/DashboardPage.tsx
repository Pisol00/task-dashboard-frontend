import { TaskCard, TaskFilters } from '@/components/features/tasks/components'
import { useTasks } from '@/components/features/tasks/api'
import { useTaskFilters } from '@/components/features/tasks/hooks'

export function DashboardPage() {
  const { filters, query, setFilters, clear, isActive } = useTaskFilters()
  const { data, isLoading, isError, isFetching } = useTasks({ ...query, limit: 6 })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
      </div>

      <TaskFilters
        value={{ q: filters.q, priority: filters.priority, status: filters.status }}
        onChange={(patch) => setFilters(patch)}
        onClear={clear}
        isActive={isActive}
      />

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

      {data && data.data.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          No tasks match your filters.
        </div>
      )}

      {data && data.data.length > 0 && (
        <div
          className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
            isFetching ? 'opacity-60' : ''
          }`}
        >
          {data.data.map((task) => (
            <TaskCard key={task.id} task={task} onClick={(t) => console.log('clicked', t.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
