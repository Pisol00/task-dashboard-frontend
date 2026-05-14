import { useTranslation } from 'react-i18next'

export function ChartPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight text-primary">
        {t('nav.dailyGraph')}
      </h2>
      <div className="surface-base border-subtle text-muted rounded-2xl border border-dashed p-16 text-center">
        Chart coming soon
      </div>
    </div>
  )
}
