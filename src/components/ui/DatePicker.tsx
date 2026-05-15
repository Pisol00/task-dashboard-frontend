import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  buttonClassName?: string
  align?: 'start' | 'end'
}

function toIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseIso(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

function buildMonthGrid(viewYear: number, viewMonth: number): Array<{
  date: Date
  inMonth: boolean
}> {
  const first = new Date(viewYear, viewMonth, 1)
  const offset = (first.getDay() + 6) % 7
  const start = new Date(viewYear, viewMonth, 1 - offset)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return { date: d, inMonth: d.getMonth() === viewMonth }
  })
}

const YEAR_RANGE = 12
const POPUP_WIDTH = 288
const POPUP_MARGIN = 8

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className,
  buttonClassName,
  align = 'start',
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [yearPickerOpen, setYearPickerOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const todayIso = useMemo(() => toIso(today), [today])

  const selectedDate = parseIso(value)
  const [view, setView] = useState(() => {
    const base = selectedDate ?? today
    return { year: base.getFullYear(), month: base.getMonth() }
  })

  useEffect(() => {
    if (!open) return
    const base = selectedDate ?? today
    setView({ year: base.getFullYear(), month: base.getMonth() })
    setYearPickerOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return

    const updatePosition = () => {
      const trigger = triggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const viewportH = window.innerHeight
      const viewportW = window.innerWidth
      const estimatedHeight = 340

      const spaceBelow = viewportH - rect.bottom
      const spaceAbove = rect.top
      const placeAbove = spaceBelow < estimatedHeight && spaceAbove > spaceBelow

      const top = placeAbove
        ? Math.max(POPUP_MARGIN, rect.top - estimatedHeight - POPUP_MARGIN)
        : rect.bottom + POPUP_MARGIN

      const rawLeft = align === 'end' ? rect.right - POPUP_WIDTH : rect.left
      const left = Math.min(
        Math.max(POPUP_MARGIN, rawLeft),
        viewportW - POPUP_WIDTH - POPUP_MARGIN,
      )

      setPosition({ top, left })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, align])

  useEffect(() => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (popupRef.current?.contains(target)) return
      setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const grid = useMemo(() => buildMonthGrid(view.year, view.month), [view])

  const yearOptions = useMemo(() => {
    const start = view.year - YEAR_RANGE
    return Array.from({ length: YEAR_RANGE * 2 + 1 }, (_, i) => start + i)
  }, [view.year])

  const handlePrevMonth = () => {
    setView((v) => {
      const m = v.month - 1
      return m < 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: m }
    })
  }

  const handleNextMonth = () => {
    setView((v) => {
      const m = v.month + 1
      return m > 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: m }
    })
  }

  const handleSelectDate = (date: Date) => {
    onChange(toIso(date))
    setOpen(false)
  }

  const displayLabel = selectedDate
    ? selectedDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : placeholder

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-subtle bg-[var(--surface-base)] pr-3 pl-3 text-sm text-primary transition-colors',
          'hover:border-default',
          'disabled:cursor-not-allowed disabled:opacity-60',
          buttonClassName,
        )}
      >
        <Calendar className="text-subtle h-4 w-4 shrink-0" />
        <span className={cn('truncate', !selectedDate && 'text-subtle')}>{displayLabel}</span>
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={popupRef}
            role="dialog"
            className="surface-base border-subtle fixed z-[60] w-72 rounded-xl border p-3 shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="text-muted hover:bg-[var(--surface-muted)] hover:text-primary flex h-7 w-7 cursor-pointer items-center justify-center rounded-md"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setYearPickerOpen((v) => !v)}
                className="hover:bg-[var(--surface-muted)] cursor-pointer rounded-md px-2.5 py-1 text-sm font-semibold text-primary"
              >
                {MONTHS[view.month]} {view.year}
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                className="text-muted hover:bg-[var(--surface-muted)] hover:text-primary flex h-7 w-7 cursor-pointer items-center justify-center rounded-md"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {yearPickerOpen ? (
              <div className="grid max-h-56 grid-cols-3 gap-1 overflow-auto p-1">
                {yearOptions.map((y) => {
                  const isCurrent = y === view.year
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setView((v) => ({ ...v, year: y }))
                        setYearPickerOpen(false)
                      }}
                      className={cn(
                        'h-9 cursor-pointer rounded-md text-sm transition-colors',
                        isCurrent
                          ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                          : 'text-secondary hover:bg-[var(--surface-muted)]',
                      )}
                    >
                      {y}
                    </button>
                  )
                })}
              </div>
            ) : (
              <>
                <div className="text-subtle mb-1 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase">
                  {WEEKDAYS.map((w) => (
                    <div key={w} className="py-1">
                      {w}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {grid.map(({ date, inMonth }) => {
                    const iso = toIso(date)
                    const isSelected = iso === value
                    const isToday = iso === todayIso
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => handleSelectDate(date)}
                        className={cn(
                          'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-sm transition-colors',
                          !inMonth && 'text-subtle',
                          inMonth &&
                            !isSelected &&
                            'text-secondary hover:bg-[var(--surface-muted)]',
                          isSelected &&
                            'bg-brand-600 font-semibold text-white hover:bg-brand-700',
                          !isSelected && isToday && 'ring-1 ring-inset ring-brand-500',
                        )}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}
