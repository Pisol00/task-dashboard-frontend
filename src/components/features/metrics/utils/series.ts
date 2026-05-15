import type { MetricSeries } from '@/types'

type SeriesConfig = {
  i18nKey: string
  color: string
  domain: [number, number]
  axisId: 'green' | 'orange' | 'blue'
}

export const SERIES: Record<MetricSeries, SeriesConfig> = {
  green: {
    i18nKey: 'chart.green',
    color: '#10b981',
    domain: [0, 100],
    axisId: 'green',
  },
  orange: {
    i18nKey: 'chart.orange',
    color: '#f59e0b',
    domain: [-100, 100],
    axisId: 'orange',
  },
  blue: {
    i18nKey: 'chart.blue',
    color: '#3b82f6',
    domain: [0, 10],
    axisId: 'blue',
  },
}

export const SERIES_KEYS: MetricSeries[] = ['green', 'orange', 'blue']

export function formatHour(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`
}
