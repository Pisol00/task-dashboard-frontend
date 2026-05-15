import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyMetrics, MetricSeries } from '@/types'
import { ChartLegend } from './ChartLegend'
import { ChartTooltip } from './ChartTooltip'
import { SERIES, SERIES_KEYS, formatHour } from '../utils/series'

type DailyChartProps = {
  data: DailyMetrics
}

type ChartRow = {
  hour: string
  green: number
  orange: number
  blue: number
}

export function DailyChart({ data }: DailyChartProps) {
  const [visible, setVisible] = useState<Record<MetricSeries, boolean>>({
    green: true,
    orange: true,
    blue: true,
  })

  const rows = useMemo<ChartRow[]>(
    () =>
      data.points.map((p) => ({
        hour: formatHour(p.hour),
        green: p.green,
        orange: p.orange,
        blue: p.blue,
      })),
    [data.points],
  )

  const toggle = (series: MetricSeries) => {
    setVisible((v) => ({ ...v, [series]: !v[series] }))
  }

  return (
    <div className="space-y-4">
      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />

            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              tickLine={{ stroke: 'var(--border-subtle)' }}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              interval={1}
            />

            <YAxis
              yAxisId="green"
              orientation="left"
              domain={SERIES.green.domain}
              tick={{ fontSize: 10, fill: SERIES.green.color }}
              tickLine={{ stroke: 'var(--border-subtle)' }}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              width={36}
            />
            <YAxis
              yAxisId="orange"
              orientation="left"
              domain={SERIES.orange.domain}
              tick={{ fontSize: 10, fill: SERIES.orange.color }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <YAxis
              yAxisId="blue"
              orientation="left"
              domain={SERIES.blue.domain}
              tick={{ fontSize: 10, fill: SERIES.blue.color }}
              tickLine={false}
              axisLine={false}
              width={28}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'var(--border-default)', strokeDasharray: '3 3' }}
            />

            {SERIES_KEYS.map((key) => (
              <Line
                key={key}
                yAxisId={SERIES[key].axisId}
                type="monotone"
                dataKey={key}
                stroke={SERIES[key].color}
                strokeWidth={2}
                dot={{ r: 2.5, strokeWidth: 0, fill: SERIES[key].color }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface-base)' }}
                hide={!visible[key]}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ChartLegend visible={visible} onToggle={toggle} />
    </div>
  )
}
