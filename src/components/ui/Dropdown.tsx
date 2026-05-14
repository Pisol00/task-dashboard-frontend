import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type DropdownProps = {
  open: boolean
  onClose: () => void
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'end'
  className?: string
}

export function Dropdown({
  open,
  onClose,
  trigger,
  children,
  align = 'end',
  className,
}: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) onClose()
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  return (
    <div ref={containerRef} className="relative">
      {trigger}
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-40 mt-2 min-w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg',
            'dark:border-slate-700 dark:bg-slate-800',
            align === 'end' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

type DropdownItemProps = {
  onClick?: () => void
  children: ReactNode
  className?: string
  selected?: boolean
  destructive?: boolean
}

export function DropdownItem({
  onClick,
  children,
  className,
  selected,
  destructive,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
        destructive
          ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700',
        selected && 'font-medium text-indigo-700 dark:text-indigo-300',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
      {children}
    </div>
  )
}

export function DropdownDivider() {
  return <div className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
}
