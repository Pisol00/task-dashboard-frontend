import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500',
        'hover:bg-slate-100 hover:text-slate-700',
        'dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200',
        'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})
