export type MetricSeries = 'green' | 'orange' | 'blue'

export type MetricPoint = {
  hour: number
  green: number
  orange: number
  blue: number
}

export type DailyMetrics = {
  date: string
  points: MetricPoint[]
}
