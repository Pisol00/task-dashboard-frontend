import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { MetricSeries } from '@/types'
import { SERIES, SERIES_KEYS } from '../utils/series'

type ChartLegendProps = {
  visible: Record<MetricSeries, boolean>
  onToggle: (series: MetricSeries) => void
}

export function ChartLegend({ visible, onToggle }: ChartLegendProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {SERIES_KEYS.map((key) => {
        const cfg = SERIES[key]
        const isOn = visible[key]
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150',
              isOn
                ? 'text-primary hover:bg-[var(--surface-muted)]'
                : 'text-subtle line-through hover:bg-[var(--surface-muted)]',
            )}
            aria-pressed={isOn}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full transition-opacity"
              style={{
                backgroundColor: cfg.color,
                opacity: isOn ? 1 : 0.3,
              }}
            />
            {t(cfg.i18nKey)}
          </button>
        )
      })}
    </div>
  )
}
