import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { cn } from '@/lib/utils'

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function getVisiblePages(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: Array<number | 'ellipsis'> = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)
  if (start > 2) pages.push('ellipsis')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages - 1) pages.push('ellipsis')
  pages.push(totalPages)
  return pages
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const visible = getVisiblePages(page, totalPages)

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <IconButton
        label="Previous page"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </IconButton>

      {visible.map((item, idx) =>
        item === 'ellipsis' ? (
          <span key={`e${idx}`} className="text-subtle px-2 text-sm">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              'h-9 min-w-9 cursor-pointer rounded-lg px-2 text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-brand',
              item === page
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-muted hover:bg-[var(--surface-muted)] hover:text-primary',
            )}
          >
            {item}
          </button>
        ),
      )}

      <IconButton
        label="Next page"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </IconButton>
    </nav>
  )
}
