import { useTranslation } from 'react-i18next'
import type { MetricSeries } from '@/types'
import { SERIES, SERIES_KEYS } from '../utils/series'

type Payload = {
  dataKey: MetricSeries
  value: number
}

type ChartTooltipProps = {
  active?: boolean
  label?: string
  payload?: Payload[]
}

export function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  const { t } = useTranslation()

  if (!active || !payload?.length) return null

  const byKey = new Map(payload.map((p) => [p.dataKey, p]))

  return (
    <div className="surface-base border-subtle rounded-lg border px-3 py-2 text-xs shadow-lg">
      <div className="border-subtle mb-1.5 border-b pb-1 text-[10px] font-semibold tracking-wide text-muted uppercase">
        {label}
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {SERIES_KEYS.map((key) => {
          const cfg = SERIES[key]
          const value = byKey.get(key)?.value
          return (
            <div key={key} className="contents">
              <span className="flex items-center gap-1.5 text-secondary">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: cfg.color }}
                />
                {t(cfg.i18nKey)}
              </span>
              <span className="text-right font-semibold tabular-nums text-primary">
                {value !== undefined ? value.toFixed(1) : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
