import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ProfileMenu } from '@/components/features/preferences/components'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-800">
      <h1 className="text-base font-medium text-slate-700 dark:text-slate-200">
        {t('nav.dashboard')}
      </h1>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          aria-label={t('header.notifications')}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <ProfileMenu />
      </div>
    </header>
  )
}
