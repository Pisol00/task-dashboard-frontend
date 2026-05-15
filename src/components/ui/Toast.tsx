import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export type ToastOptions = {
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type Toast = {
  id: string
  title?: string
  description?: string
  variant: ToastVariant
  duration: number
}

type ToastContextValue = {
  show: (options: ToastOptions) => string
  success: (description: string, title?: string) => string
  error: (description: string, title?: string) => string
  warning: (description: string, title?: string) => string
  info: (description: string, title?: string) => string
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DEFAULT_DURATION = 4000

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const ACCENT: Record<ToastVariant, string> = {
  success: 'text-success-600 dark:text-success-500',
  error: 'text-danger-600 dark:text-danger-500',
  warning: 'text-warning-600 dark:text-warning-500',
  info: 'text-info-600 dark:text-info-500',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const handle = timers.current.get(id)
    if (handle) {
      clearTimeout(handle)
      timers.current.delete(id)
    }
  }, [])

  const show = useCallback(
    ({ title, description, variant = 'info', duration = DEFAULT_DURATION }: ToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const toast: Toast = { id, title, description, variant, duration }
      setToasts((prev) => [...prev, toast])
      if (duration > 0) {
        const handle = setTimeout(() => dismiss(id), duration)
        timers.current.set(id, handle)
      }
      return id
    },
    [dismiss],
  )

  const success = useCallback(
    (description: string, title?: string) =>
      show({ variant: 'success', description, title }),
    [show],
  )
  const error = useCallback(
    (description: string, title?: string) => show({ variant: 'error', description, title }),
    [show],
  )
  const warning = useCallback(
    (description: string, title?: string) =>
      show({ variant: 'warning', description, title }),
    [show],
  )
  const info = useCallback(
    (description: string, title?: string) => show({ variant: 'info', description, title }),
    [show],
  )

  useEffect(() => {
    const map = timers.current
    return () => {
      for (const handle of map.values()) clearTimeout(handle)
      map.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={{ show, dismiss, success, error, warning, info }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            role="region"
            aria-label="Notifications"
            className="pointer-events-none fixed top-4 right-4 z-[70] flex w-full max-w-sm flex-col gap-2"
          >
            {toasts.map((t) => {
              const Icon = ICONS[t.variant]
              return (
                <div
                  key={t.id}
                  role="status"
                  className="surface-base border-subtle pointer-events-auto flex items-start gap-3 rounded-lg border p-3 shadow-lg"
                >
                  <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', ACCENT[t.variant])} />
                  <div className="min-w-0 flex-1">
                    {t.title && (
                      <div className="text-sm font-semibold text-primary">{t.title}</div>
                    )}
                    {t.description && (
                      <div className={cn('text-sm text-secondary', t.title && 'mt-0.5')}>
                        {t.description}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    aria-label="Dismiss"
                    className="text-subtle hover:bg-[var(--surface-muted)] hover:text-primary -mt-0.5 -mr-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
