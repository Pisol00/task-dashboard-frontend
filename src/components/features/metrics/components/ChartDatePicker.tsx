import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button, IconButton, Input } from '@/components/ui'

type ChartDatePickerProps = {
  date: string
  isToday: boolean
  onChange: (date: string) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function ChartDatePicker({
  date,
  isToday,
  onChange,
  onPrev,
  onNext,
  onToday,
}: ChartDatePickerProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <IconButton label={t('chart.previousDay')} onClick={onPrev}>
        <ChevronLeft className="h-4 w-4" />
      </IconButton>

      <Input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        leadingIcon={<Calendar className="h-4 w-4" />}
        aria-label={t('chart.selectDate')}
        containerClassName="w-48"
      />

      <IconButton label={t('chart.nextDay')} onClick={onNext}>
        <ChevronRight className="h-4 w-4" />
      </IconButton>

      <Button variant="ghost" size="sm" onClick={onToday} disabled={isToday}>
        {t('chart.today')}
      </Button>
    </div>
  )
}
