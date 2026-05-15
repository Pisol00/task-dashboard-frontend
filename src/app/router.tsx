import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/components/shared/layout/AppLayout'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { ROUTES } from '@/constants'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

const ChartPage = lazy(() =>
  import('@/pages/ChartPage').then((m) => ({ default: m.ChartPage })),
)

function ChartFallback() {
  return (
    <div className="text-muted py-12 text-center text-sm">Loading…</div>
  )
}

export const router = createBrowserRouter([
  {
    path: ROUTES.dashboard,
    element: (
      <ErrorBoundary>
        <AppLayout />
      </ErrorBoundary>
    ),
    children: [
      { index: true, Component: DashboardPage },
      {
        path: ROUTES.chart.slice(1),
        element: (
          <Suspense fallback={<ChartFallback />}>
            <ChartPage />
          </Suspense>
        ),
      },
      { path: ROUTES.myTasks.slice(1), element: <PlaceholderPage title="My Tasks" /> },
      { path: ROUTES.team.slice(1), element: <PlaceholderPage title="Team" /> },
      { path: ROUTES.settings.slice(1), element: <PlaceholderPage title="Settings" /> },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
