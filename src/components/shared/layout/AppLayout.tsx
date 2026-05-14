import { Outlet } from 'react-router'
import { useLocalStorage } from '@/hooks'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const SIDEBAR_COLLAPSED_KEY = 'taskflow:sidebar-collapsed'

export function AppLayout() {
  const [collapsed, setCollapsed] = useLocalStorage(SIDEBAR_COLLAPSED_KEY, false)

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
