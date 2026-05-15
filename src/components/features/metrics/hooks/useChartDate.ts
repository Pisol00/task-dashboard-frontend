import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime())
}

function addDays(iso: string, delta: number): string {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

export function useChartDate() {
  const [searchParams, setSearchParams] = useSearchParams()

  const date = useMemo(() => {
    const raw = searchParams.get('date')
    return raw && isValidIsoDate(raw) ? raw : todayIso()
  }, [searchParams])

  const setDate = useCallback(
    (next: string) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          if (next === todayIso()) params.delete('date')
          else params.set('date', next)
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const goPrev = useCallback(() => setDate(addDays(date, -1)), [date, setDate])
  const goNext = useCallback(() => setDate(addDays(date, 1)), [date, setDate])
  const goToday = useCallback(() => setDate(todayIso()), [setDate])

  const isToday = date === todayIso()

  return { date, setDate, goPrev, goNext, goToday, isToday }
}
