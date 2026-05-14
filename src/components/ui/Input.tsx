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
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <span className="text-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-10 w-full rounded-lg border border-subtle bg-[var(--surface-base)] text-sm text-primary transition-shadow',
            'placeholder:text-subtle',
            'focus:border-brand-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60',
            leadingIcon ? 'pl-10' : 'pl-3',
            trailingIcon ? 'pr-10' : 'pr-3',
            error && 'border-danger-500 focus:border-danger-500',
            className,
          )}
          {...rest}
        />
        {trailingIcon && (
          <span className="text-subtle absolute top-1/2 right-3 -translate-y-1/2">
            {trailingIcon}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-danger-600">{error}</span>}
    </div>
  )
})
