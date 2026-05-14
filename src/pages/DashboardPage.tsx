import { useTasks } from '@/components/features/tasks/api'
import { TaskBoard, TaskFilters } from '@/components/features/tasks/components'
import { useTaskFilters } from '@/components/features/tasks/hooks'
import { Pagination } from '@/components/shared/Pagination'

const PER_STATUS = 3

export function DashboardPage() {
  const { filters, query, setFilters, clear, isActive } = useTaskFilters()
  const { data, isLoading, isError, isFetching } = useTasks({ ...query, limit: PER_STATUS })

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
        <>
          <div className={`transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
            <TaskBoard
              tasks={data.data}
              onCardClick={(t) => console.log('clicked', t.id)}
            />
          </div>

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({ page })}
          />
        </>
      )}
    </div>
  )
}
