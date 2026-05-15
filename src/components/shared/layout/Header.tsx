import { useEffect, useState } from 'react'
import { Bell, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { ProfileMenu } from '@/components/features/preferences/components'
import { parseSearchQuery } from '@/components/features/tasks/utils/parseSearchQuery'
import { IconButton, Input } from '@/components/ui'
import { ROUTES } from '@/constants'
import { useDebounce } from '@/hooks'

export function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 300)

  useEffect(() => {
    if (location.pathname !== ROUTES.dashboard) {
      setValue('')
      return
    }
    const q = searchParams.get('q') ?? ''
    const priority = searchParams.get('priority') ?? ''
    const status = searchParams.get('status') ?? ''
    const tag = searchParams.get('tag') ?? ''
    setValue(q || priority || status || tag || '')
  }, [location.pathname, searchParams])

  useEffect(() => {
    const parsed = parseSearchQuery(debounced)
    const onDashboard = location.pathname === ROUTES.dashboard

    if (!onDashboard) {
      if (!debounced.trim()) return
      const next = new URLSearchParams()
      if (parsed.q) next.set('q', parsed.q)
      if (parsed.priority) next.set('priority', parsed.priority)
      if (parsed.status) next.set('status', parsed.status)
      if (parsed.tag) next.set('tag', parsed.tag)
      navigate({ pathname: ROUTES.dashboard, search: next.toString() })
      return
    }

    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('priority')
    next.delete('status')
    next.delete('tag')
    next.delete('page')
    if (parsed.q) next.set('q', parsed.q)
    if (parsed.priority) next.set('priority', parsed.priority)
    if (parsed.status) next.set('status', parsed.status)
    if (parsed.tag) next.set('tag', parsed.tag)

    if (next.toString() === searchParams.toString()) return
    navigate(
      { pathname: ROUTES.dashboard, search: next.toString() },
      { replace: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return (
    <header className="glass border-subtle relative z-30 flex h-16 shrink-0 items-center justify-end gap-3 border-b px-6">
      <div className="hidden w-full max-w-xs sm:block">
        <Input
          type="search"
          placeholder={t('header.searchPlaceholder')}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          leadingIcon={<Search className="h-4 w-4" />}
          aria-label={t('common.search')}
        />
      </div>

      <IconButton label={t('header.notifications')} className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-[var(--surface-base)]" />
      </IconButton>

      <ProfileMenu />
    </header>
  )
}
