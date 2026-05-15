import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
import { Button, useToast } from '@/components/ui'
import { useDisclosure } from '@/hooks'
import type { Task } from '@/types'

const PER_STATUS = 3

export function DashboardPage() {
  const { t } = useTranslation()
  const toast = useToast()
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
    try {
      if (formMode === 'edit' && selectedTask) {
        await updateMutation.mutateAsync({ id: selectedTask.id, patch: input })
        toast.success(t('toast.taskUpdated'))
      } else {
        await createMutation.mutateAsync(input)
        toast.success(t('toast.taskCreated'))
      }
      formDialog.close()
    } catch {
      toast.error(
        formMode === 'edit' ? t('toast.taskUpdateFailed') : t('toast.taskCreateFailed'),
      )
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedTask) return
    try {
      await deleteMutation.mutateAsync(selectedTask.id)
      toast.success(t('toast.taskDeleted'))
      confirmDelete.close()
      detailDialog.close()
    } catch {
      toast.error(t('toast.taskDeleteFailed'))
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">
            {t('dashboard.title')}
          </h2>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          {t('dashboard.newTask')}
        </Button>
      </div>

      <div className="surface-base border-subtle rounded-2xl border p-4 shadow-xs">
        <TaskFilters
          value={{ q: filters.q, priority: filters.priority, status: filters.status }}
          onChange={(patch) => setFilters(patch)}
          onClear={clear}
          isActive={isActive}
        />
      </div>

      {isLoading && (
        <div className="surface-base border-subtle text-muted rounded-2xl border border-dashed p-16 text-center">
          {t('dashboard.loadingTasks')}
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-danger-200 bg-danger-50 p-6 text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-300">
          {t('dashboard.loadFailed')}
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="surface-base border-subtle rounded-2xl border border-dashed p-16 text-center">
          <p className="text-base font-medium text-secondary">{t('dashboard.noTasksTitle')}</p>
          <p className="text-muted mt-1.5 text-sm">
            {isActive ? t('dashboard.noTasksFiltered') : t('dashboard.noTasksEmpty')}
          </p>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div
            className={`transition-opacity duration-200 ${isFetching ? 'opacity-60' : ''}`}
          >
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
        title={t('dialogs.deleteTitle')}
        description={
          selectedTask ? (
            <span
              dangerouslySetInnerHTML={{
                __html: t('dialogs.deleteDescription', { title: selectedTask.title }),
              }}
            />
          ) : null
        }
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
