import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import {
  createTask,
  deleteTask,
  updateTask,
  type CreateTaskInput,
  type UpdateTaskInput,
} from './tasks.api'

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all })
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateTaskInput }) => updateTask(id, patch),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      qc.setQueryData(queryKeys.tasks.detail(updated.id), updated)
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all })
    },
  })
}
