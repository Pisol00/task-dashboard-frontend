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
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-9 w-full appearance-none rounded-md border border-slate-300 bg-white pr-9 pl-3 text-sm text-slate-900',
            'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-slate-50',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500',
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
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </div>
  )
})
