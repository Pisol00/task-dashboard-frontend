import { useEffect, useRef, useState, useId } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ComboboxOption<T extends string = string> = {
  value: T
  label: string
}

type ComboboxProps<T extends string = string> = {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<ComboboxOption<T>>
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  containerClassName?: string
  align?: 'start' | 'end'
  buttonClassName?: string
}

export function Combobox<T extends string = string>({
  value,
  onChange,
  options,
  label,
  placeholder,
  disabled,
  className,
  containerClassName,
  align = 'start',
  buttonClassName,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const id = useId()

  const selected = options.find((opt) => opt.value === value)

  useEffect(() => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
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

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      <div ref={containerRef} className={cn('relative', className)}>
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            'flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-subtle bg-[var(--surface-base)] px-3 text-sm text-primary transition-colors',
            'hover:border-default',
            'focus-visible:outline-none focus-visible:ring-brand',
            'disabled:cursor-not-allowed disabled:opacity-60',
            buttonClassName,
          )}
        >
          <span className={cn('truncate', !selected && 'text-subtle')}>
            {selected?.label ?? placeholder ?? ''}
          </span>
          <ChevronDown
            className={cn(
              'text-subtle h-4 w-4 shrink-0 transition-transform duration-150',
              open && 'rotate-180',
            )}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className={cn(
              'surface-base border-subtle absolute z-40 mt-2 max-h-72 min-w-full overflow-auto rounded-xl border p-1.5 shadow-lg',
              align === 'end' ? 'right-0' : 'left-0',
            )}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors duration-150',
                    isSelected
                      ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                      : 'text-secondary hover:bg-[var(--surface-muted)]',
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-brand-600" />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
