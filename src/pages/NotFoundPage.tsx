import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/constants'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        {t('errors.notFoundCode')}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
        {t('errors.notFoundTitle')}
      </h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        {t('errors.notFoundDescription')}
      </p>
      <Link
        to={ROUTES.dashboard}
        className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        {t('errors.backToDashboard')}
      </Link>
    </div>
  )
}
