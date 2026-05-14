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
            'surface-base border-subtle absolute z-50 mt-2 min-w-56 rounded-xl border p-1.5 shadow-lg',
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
        'flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors duration-150',
        destructive
          ? 'text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10'
          : 'text-secondary hover:bg-[var(--surface-muted)]',
        selected && 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-subtle px-3 pt-2 pb-1.5 text-xs font-semibold tracking-wide uppercase">
      {children}
    </div>
  )
}

export function DropdownDivider() {
  return <div className="border-subtle my-1.5 h-px border-t" />
}
