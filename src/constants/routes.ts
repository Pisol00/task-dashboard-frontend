export const ROUTES = {
  dashboard: '/',
  myTasks: '/my-tasks',
  chart: '/chart',
  team: '/team',
  settings: '/settings',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
