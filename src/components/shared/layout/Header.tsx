import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ProfileMenu } from '@/components/features/preferences/components'
import { IconButton } from '@/components/ui'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="glass border-subtle relative z-30 flex h-16 shrink-0 items-center justify-end border-b px-6">
      <div className="flex items-center gap-3">
        <IconButton label={t('header.notifications')} className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-[var(--surface-base)]" />
        </IconButton>

        <ProfileMenu />
      </div>
    </header>
  )
}
