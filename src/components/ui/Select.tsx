import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SelectOption<T extends string = string> = {
  value: T
  label: string
}

type SelectProps<T extends string = string> = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children'
> & {
  label?: string
  error?: string
  options: ReadonlyArray<SelectOption<T>>
  placeholder?: string
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, placeholder, id, className, containerClassName, ...rest },
  ref,
) {
  const fallbackId = useId()
  const selectId = id ?? fallbackId

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-10 w-full cursor-pointer appearance-none rounded-lg border border-subtle bg-[var(--surface-base)] pr-10 pl-3 text-sm text-primary',
            'focus:border-brand-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-danger-500 focus:border-danger-500',
            className,
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="text-subtle pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
      </div>
      {error && <span className="text-xs text-danger-600">{error}</span>}
    </div>
  )
})
