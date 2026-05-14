import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    leadingIcon,
    trailingIcon,
    id,
    className,
    containerClassName,
    type = 'text',
    ...rest
  },
  ref,
) {
  const fallbackId = useId()
  const inputId = id ?? fallbackId

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-9 w-full rounded-md border border-slate-300 bg-white text-sm text-slate-900',
            'placeholder:text-slate-400',
            'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-slate-50',
            leadingIcon ? 'pl-9' : 'pl-3',
            trailingIcon ? 'pr-9' : 'pr-3',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500',
            className,
          )}
          {...rest}
        />
        {trailingIcon && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
            {trailingIcon}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </div>
  )
})
