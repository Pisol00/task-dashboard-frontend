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
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900',
          'placeholder:text-slate-400',
          'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:outline-none',
          'disabled:cursor-not-allowed disabled:bg-slate-50',
          'resize-y',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500',
          className,
        )}
        {...rest}
      />
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </div>
  )
})
