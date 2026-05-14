import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/components/shared/layout/AppLayout'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { ROUTES } from '@/constants'
import { ChartPage } from '@/pages/ChartPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

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
      { path: ROUTES.chart.slice(1), Component: ChartPage },
      { path: ROUTES.myTasks.slice(1), element: <PlaceholderPage title="My Tasks" /> },
      { path: ROUTES.team.slice(1), element: <PlaceholderPage title="Team" /> },
      { path: ROUTES.settings.slice(1), element: <PlaceholderPage title="Settings" /> },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
