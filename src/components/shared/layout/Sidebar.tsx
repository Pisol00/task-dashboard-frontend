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
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants'

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
}

const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.myTasks, label: 'My Tasks', icon: ListChecks },
  { to: ROUTES.chart, label: 'Daily Graph', icon: LineChart },
  { to: ROUTES.team, label: 'Team', icon: Users },
  { to: ROUTES.settings, label: 'Settings', icon: Settings },
]

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-semibold text-white">
            T
          </div>
          {!collapsed && (
            <span className="truncate font-semibold text-slate-900">TaskFlow</span>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === ROUTES.dashboard}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                collapsed && 'justify-center px-0',
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex h-12 items-center gap-3 border-t border-slate-200 px-4 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700',
          collapsed && 'justify-center px-0',
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronsRight className="h-5 w-5" />
        ) : (
          <>
            <ChevronsLeft className="h-5 w-5" />
            <span>Collapse</span>
          </>
        )}
      </button>
    </aside>
  )
}
