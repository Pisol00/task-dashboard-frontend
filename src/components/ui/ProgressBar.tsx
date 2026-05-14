import { cn } from '@/lib/utils'

type ProgressBarProps = {
  value: number
  className?: string
  barClassName?: string
}

export function ProgressBar({ value, className, barClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-slate-200', className)}
    >
      <div
        className={cn('h-full rounded-full bg-indigo-500 transition-[width]', barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
