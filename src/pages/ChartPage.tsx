import { useTranslation } from 'react-i18next'

export function ChartPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t('nav.dailyGraph')}
        </h2>
      </div>
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        Chart coming soon
      </div>
    </div>
  )
}
