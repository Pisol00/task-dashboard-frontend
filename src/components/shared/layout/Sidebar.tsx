import { NavLink } from 'react-router'
import {
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListChecks,
  LineChart,
  Settings,
  Users,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/ui'
import { ROUTES } from '@/constants'
import { cn } from '@/lib/utils'

type NavItem = {
  to: string
  i18nKey: string
  icon: typeof LayoutDashboard
}

const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.dashboard, i18nKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: ROUTES.myTasks, i18nKey: 'nav.myTasks', icon: ListChecks },
  { to: ROUTES.chart, i18nKey: 'nav.dailyGraph', icon: LineChart },
  { to: ROUTES.team, i18nKey: 'nav.team', icon: Users },
  { to: ROUTES.settings, i18nKey: 'nav.settings', icon: Settings },
]

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <aside
      className={cn(
        'glass flex h-screen shrink-0 flex-col transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div
        className={cn(
          'border-subtle flex h-16 items-center border-b',
          collapsed ? 'justify-center px-0' : 'justify-between px-4',
        )}
      >
        <div className={cn('flex items-center gap-2.5', !collapsed && 'overflow-hidden')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 font-semibold text-white shadow-sm">
            T
          </div>
          {!collapsed && (
            <span className="truncate text-base font-semibold text-primary">TaskFlow</span>
          )}
        </div>

        {!collapsed && (
          <IconButton label={t('sidebar.collapse')} onClick={onToggle}>
            <ChevronsLeft className="h-4 w-4" />
          </IconButton>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center px-2 pt-3">
          <IconButton label={t('sidebar.expand')} onClick={onToggle}>
            <ChevronsRight className="h-4 w-4" />
          </IconButton>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3 py-5">
        {NAV_ITEMS.map((item) => {
          const label = t(item.i18nKey)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.dashboard}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                    : 'text-muted hover:bg-[var(--surface-muted)] hover:text-primary',
                  collapsed && 'justify-center px-0',
                )
              }
              title={collapsed ? label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
