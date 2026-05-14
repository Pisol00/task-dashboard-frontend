import { cn } from '@/lib/utils'
import type { Assignee } from '@/types'

type AvatarSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

type AvatarProps = {
  user: Assignee
  size?: AvatarSize
  className?: string
}

export function Avatar({ user, size = 'md', className }: AvatarProps) {
  return (
    <span
      title={user.name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-semibold text-brand-700 ring-2 ring-[var(--surface-base)]',
        SIZE_CLASSES[size],
        className,
      )}
    >
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
      ) : (
        initials(user.name)
      )}
    </span>
  )
}

type AvatarStackProps = {
  users: Assignee[]
  max?: number
  size?: AvatarSize
}

export function AvatarStack({ users, max = 3, size = 'sm' }: AvatarStackProps) {
  const visible = users.slice(0, max)
  const overflow = users.length - visible.length

  return (
    <div className="flex -space-x-2">
      {visible.map((user) => (
        <Avatar key={user.id} user={user} size={size} />
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            'text-muted inline-flex items-center justify-center rounded-full bg-[var(--surface-muted)] font-semibold ring-2 ring-[var(--surface-base)]',
            SIZE_CLASSES[size],
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
