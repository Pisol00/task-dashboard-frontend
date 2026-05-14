import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from '@/components/features/tasks/api'
import {
  TaskBoard,
  TaskDetailDialog,
  TaskFilters,
  TaskFormDialog,
} from '@/components/features/tasks/components'
import { useTaskFilters } from '@/components/features/tasks/hooks'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Pagination } from '@/components/shared/Pagination'
import { Button } from '@/components/ui'
import { useDisclosure } from '@/hooks'
import type { Task } from '@/types'

const PER_STATUS = 3

export function DashboardPage() {
  const { filters, query, setFilters, clear, isActive } = useTaskFilters()
  const { data, isLoading, isError, isFetching } = useTasks({ ...query, limit: PER_STATUS })

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const detailDialog = useDisclosure()
  const formDialog = useDisclosure()
  const confirmDelete = useDisclosure()

  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  const handleCardClick = (task: Task) => {
    setSelectedTask(task)
    detailDialog.open()
  }

  const handleCreateClick = () => {
    setSelectedTask(null)
    setFormMode('create')
    formDialog.open()
  }

  const handleEditClick = (task: Task) => {
    detailDialog.close()
    setSelectedTask(task)
    setFormMode('edit')
    formDialog.open()
  }

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task)
    confirmDelete.open()
  }

  const handleFormClose = () => {
    formDialog.close()
    if (formMode === 'edit' && selectedTask) {
      detailDialog.open()
    }
  }

  const handleSubmit = async (input: Parameters<typeof createMutation.mutateAsync>[0]) => {
    if (formMode === 'edit' && selectedTask) {
      await updateMutation.mutateAsync({ id: selectedTask.id, patch: input })
    } else {
      await createMutation.mutateAsync(input)
    }
    formDialog.close()
  }

  const handleConfirmDelete = async () => {
    if (!selectedTask) return
    await deleteMutation.mutateAsync(selectedTask.id)
    confirmDelete.close()
    detailDialog.close()
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <TaskFilters
          value={{ q: filters.q, priority: filters.priority, status: filters.status }}
          onChange={(patch) => setFilters(patch)}
          onClear={clear}
          isActive={isActive}
        />
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

      {data && data.data.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          <p className="font-medium text-slate-700">No tasks found</p>
          <p className="mt-1 text-sm">
            {isActive ? 'Try adjusting your filters.' : 'Create your first task to get started.'}
          </p>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className={`transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
            <TaskBoard tasks={data.data} onCardClick={handleCardClick} />
          </div>

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({ page })}
          />
        </>
      )}

      <TaskDetailDialog
        task={selectedTask}
        open={detailDialog.isOpen}
        onClose={detailDialog.close}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <TaskFormDialog
        open={formDialog.isOpen}
        onClose={handleFormClose}
        task={formMode === 'edit' ? selectedTask : null}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        open={confirmDelete.isOpen}
        onClose={confirmDelete.close}
        onConfirm={handleConfirmDelete}
        title="Delete task?"
        description={
          selectedTask ? (
            <>
              This will permanently delete{' '}
              <span className="font-semibold text-slate-900">{selectedTask.title}</span>. This
              action cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
