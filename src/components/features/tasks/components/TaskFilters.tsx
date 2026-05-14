import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button, Combobox, Input, type ComboboxOption } from '@/components/ui'
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

export function TaskFilters({ value, onChange, onClear, isActive }: TaskFiltersProps) {
  const { t } = useTranslation()
  const [searchInput, setSearchInput] = useState(value.q)
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    if (debouncedSearch !== value.q) onChange({ q: debouncedSearch })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  useEffect(() => {
    setSearchInput(value.q)
  }, [value.q])

  const priorityOptions: ComboboxOption<Priority | 'All'>[] = useMemo(
    () => [
      { value: 'All', label: t('filters.allPriorities') },
      ...PRIORITIES.map((p) => ({ value: p, label: p })),
    ],
    [t],
  )

  const statusOptions: ComboboxOption<TaskStatus | 'All'>[] = useMemo(
    () => [
      { value: 'All', label: t('filters.statusAll') },
      ...TASK_STATUSES.map((s) => ({ value: s, label: s })),
    ],
    [t],
  )

  const clearLabel = t('filters.clear')

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        type="search"
        placeholder={t('filters.searchPlaceholder')}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        leadingIcon={<Search className="h-4 w-4" />}
        containerClassName="flex-1"
      />

      <Combobox<Priority | 'All'>
        value={value.priority}
        onChange={(v) => onChange({ priority: v })}
        options={priorityOptions}
        containerClassName="sm:w-44"
      />

      <Combobox<TaskStatus | 'All'>
        value={value.status}
        onChange={(v) => onChange({ status: v })}
        options={statusOptions}
        containerClassName="sm:w-44"
      />

      <Button
        variant="ghost"
        size="md"
        onClick={onClear}
        disabled={!isActive}
        className="sm:px-2.5"
        aria-label={clearLabel}
        title={clearLabel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
