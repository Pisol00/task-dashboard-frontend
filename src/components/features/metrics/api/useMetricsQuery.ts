import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants'
import { fetchDailyMetrics } from './metrics.api'

export function useDailyMetrics(date: string) {
  return useQuery({
    queryKey: queryKeys.metrics.daily(date),
    queryFn: () => fetchDailyMetrics(date),
    staleTime: 60 * 1000,
  })
}
