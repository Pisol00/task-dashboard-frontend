import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDailyMetrics } from '@/components/features/metrics/api'
import {
  ChartDatePicker,
  DailyChart,
  ExportPdfButton,
} from '@/components/features/metrics/components'
import { useChartDate } from '@/components/features/metrics/hooks'

export function ChartPage() {
  const { t } = useTranslation()
  const { date, setDate, goPrev, goNext, goToday, isToday } = useChartDate()
  const { data, isLoading, isError, isFetching } = useDailyMetrics(date)
  const chartRef = useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-primary">
          {t('chart.title')}
        </h2>
        {data && (
          <ExportPdfButton targetRef={chartRef} filename={`daily-graph-${date}.pdf`} />
        )}
      </div>

      <ChartDatePicker
        date={date}
        isToday={isToday}
        onChange={setDate}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
      />

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

        {data && (
          <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-60' : ''}`}>
            <div className="mb-4 flex items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-primary">{t('chart.title')}</h3>
              <span className="text-sm text-muted">{date}</span>
            </div>
            <DailyChart data={data} />
          </div>
        )}
      </div>
    </div>
  )
}
