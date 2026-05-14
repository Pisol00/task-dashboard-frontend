import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, type Language } from '@/i18n'

export function useLanguage() {
  const { i18n } = useTranslation()

  const language = (
    SUPPORTED_LANGUAGES.includes(i18n.resolvedLanguage as Language)
      ? i18n.resolvedLanguage
      : 'en'
  ) as Language

  const setLanguage = useCallback(
    (lang: Language) => {
      void i18n.changeLanguage(lang)
    },
    [i18n],
  )

  return { language, setLanguage, supported: SUPPORTED_LANGUAGES }
}
