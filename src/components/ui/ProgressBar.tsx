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
      className={cn('bg-track h-1.5 w-full overflow-hidden rounded-full', className)}
    >
      <div
        className={cn('h-full rounded-full bg-brand-500 transition-[width] duration-300', barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
