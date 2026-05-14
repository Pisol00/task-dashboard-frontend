import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryProvider } from '@/app/QueryProvider'
import { router } from '@/app/router'
import { env } from '@/config/env'
import '@/i18n'
import '@/index.css'

async function enableMocking() {
  if (!env.enableMocks) return
  const { worker } = await import('@/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </StrictMode>,
  )
})
