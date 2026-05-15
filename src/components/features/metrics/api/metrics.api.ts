import { apiFetch } from '@/lib/api-client'
import type { DailyMetrics } from '@/types'

export function fetchDailyMetrics(date?: string) {
  return apiFetch<DailyMetrics>('/metrics', {
    params: { date },
  })
}
