import { useEffect } from 'react'
import { useLocalStorage } from '@/hooks'

export type ThemePref = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'taskflow:theme'
const DARK_MEDIA = '(prefers-color-scheme: dark)'

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(DARK_MEDIA).matches
}

function resolveDark(pref: ThemePref): boolean {
  if (pref === 'system') return systemPrefersDark()
  return pref === 'dark'
}

function applyTheme(pref: ThemePref) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', resolveDark(pref))
}

export function useTheme() {
  const [pref, setPref] = useLocalStorage<ThemePref>(STORAGE_KEY, 'system')

  useEffect(() => {
    applyTheme(pref)
  }, [pref])

  useEffect(() => {
    if (pref !== 'system') return
    const mql = window.matchMedia(DARK_MEDIA)
    const handler = () => applyTheme('system')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [pref])

  return { theme: pref, setTheme: setPref, resolvedDark: resolveDark(pref) }
}
