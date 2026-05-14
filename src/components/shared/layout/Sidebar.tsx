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
        'flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200',
        'dark:border-slate-700 dark:bg-slate-800',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-700',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-semibold text-white">
            T
          </div>
          {!collapsed && (
            <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
              TaskFlow
            </span>
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

      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const label = t(item.i18nKey)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.dashboard}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100',
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
