import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import { fetchUsers } from './tasks.api'

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
  })
}
