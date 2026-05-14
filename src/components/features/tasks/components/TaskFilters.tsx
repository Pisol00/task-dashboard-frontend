import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button, Input, Select, type SelectOption } from '@/components/ui'
import { PRIORITIES, TASK_STATUSES } from '@/constants'
import { useDebounce } from '@/hooks'
import type { Priority, TaskStatus } from '@/types'

type FiltersValue = {
  q: string
  priority: Priority | 'All'
  status: TaskStatus | 'All'
}

type TaskFiltersProps = {
  value: FiltersValue
  onChange: (patch: Partial<FiltersValue>) => void
  onClear: () => void
  isActive: boolean
}

const PRIORITY_OPTIONS: SelectOption[] = [
  { value: 'All', label: 'All Priorities' },
  ...PRIORITIES.map((p) => ({ value: p, label: p })),
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'All', label: 'Status: All' },
  ...TASK_STATUSES.map((s) => ({ value: s, label: s })),
]

export function TaskFilters({ value, onChange, onClear, isActive }: TaskFiltersProps) {
  const [searchInput, setSearchInput] = useState(value.q)
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    if (debouncedSearch !== value.q) onChange({ q: debouncedSearch })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  useEffect(() => {
    setSearchInput(value.q)
  }, [value.q])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        type="search"
        placeholder="Search tasks..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        leadingIcon={<Search className="h-4 w-4" />}
        containerClassName="flex-1"
      />

      <Select
        value={value.priority}
        onChange={(e) => onChange({ priority: e.target.value as Priority | 'All' })}
        options={PRIORITY_OPTIONS}
        containerClassName="sm:w-44"
      />

      <Select
        value={value.status}
        onChange={(e) => onChange({ status: e.target.value as TaskStatus | 'All' })}
        options={STATUS_OPTIONS}
        containerClassName="sm:w-44"
      />

      <Button
        variant="ghost"
        size="md"
        onClick={onClear}
        disabled={!isActive}
        className="sm:px-2"
        aria-label="Clear filters"
        title="Clear filters"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
