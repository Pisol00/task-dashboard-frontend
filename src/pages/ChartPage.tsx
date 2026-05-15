import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDailyMetrics } from '@/components/features/metrics/api'
import {
  DailyChart,
  ExportPdfButton,
} from '@/components/features/metrics/components'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function ChartPage() {
  const { t } = useTranslation()
  const date = today()
  const { data, isLoading, isError } = useDailyMetrics(date)
  const chartRef = useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-primary">
          {t('chart.title')}
        </h2>
        {data && (
          <ExportPdfButton
            targetRef={chartRef}
            filename={`daily-graph-${date}.pdf`}
            title={`${t('chart.title')} — ${date}`}
          />
        )}
      </div>

      <div
        ref={chartRef}
        className="surface-base border-subtle rounded-2xl border p-6 shadow-xs"
      >
        {isLoading && (
          <div className="text-muted py-12 text-center">{t('chart.loading')}</div>
        )}

        {isError && (
          <div className="rounded-lg border border-danger-200 bg-danger-50 p-6 text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-300">
            {t('chart.loadFailed')}
          </div>
        )}

        {data && <DailyChart data={data} />}
      </div>
    </div>
  )
}
