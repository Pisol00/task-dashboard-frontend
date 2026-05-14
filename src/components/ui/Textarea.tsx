import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className, containerClassName, rows = 3, ...rest },
  ref,
) {
  const fallbackId = useId()
  const textareaId = id ?? fallbackId

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full rounded-lg border border-subtle bg-[var(--surface-base)] px-3 py-2 text-sm text-primary',
          'placeholder:text-subtle resize-y',
          'focus:border-brand-500 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error && 'border-danger-500 focus:border-danger-500',
          className,
        )}
        {...rest}
      />
      {error && <span className="text-xs text-danger-600">{error}</span>}
    </div>
  )
})
