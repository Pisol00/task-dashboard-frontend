import { Check, ChevronDown, LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
} from '@/components/ui'
import { useDisclosure } from '@/hooks'
import { cn } from '@/lib/utils'
import type { Language } from '@/i18n'
import { useLanguage, useTheme, type ThemePref } from '../hooks'

const THEME_OPTIONS: Array<{ value: ThemePref; icon: typeof Sun; labelKey: string }> = [
  { value: 'light', icon: Sun, labelKey: 'preferences.themeLight' },
  { value: 'dark', icon: Moon, labelKey: 'preferences.themeDark' },
  { value: 'system', icon: Monitor, labelKey: 'preferences.themeSystem' },
]

const LANGUAGE_OPTIONS: Array<{ value: Language; labelKey: string }> = [
  { value: 'en', labelKey: 'preferences.languageEn' },
  { value: 'th', labelKey: 'preferences.languageTh' },
]

export function ProfileMenu() {
  const { t } = useTranslation()
  const { isOpen, toggle, close } = useDisclosure()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()

  return (
    <Dropdown
      open={isOpen}
      onClose={close}
      trigger={
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'flex h-9 items-center gap-2 rounded-full pr-3 pl-1 transition-colors',
            'hover:bg-slate-100 dark:hover:bg-slate-700',
            'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
          )}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
            AD
          </span>
          <span className="text-sm text-slate-700 dark:text-slate-200">Admin</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      }
    >
      <DropdownLabel>{t('preferences.theme')}</DropdownLabel>
      {THEME_OPTIONS.map(({ value, icon: Icon, labelKey }) => (
        <DropdownItem
          key={value}
          onClick={() => setTheme(value)}
          selected={theme === value}
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1">{t(labelKey)}</span>
          {theme === value && <Check className="h-4 w-4 text-indigo-600" />}
        </DropdownItem>
      ))}

      <DropdownDivider />

      <DropdownLabel>{t('preferences.language')}</DropdownLabel>
      {LANGUAGE_OPTIONS.map(({ value, labelKey }) => (
        <DropdownItem
          key={value}
          onClick={() => setLanguage(value)}
          selected={language === value}
        >
          <span className="flex-1">{t(labelKey)}</span>
          {language === value && <Check className="h-4 w-4 text-indigo-600" />}
        </DropdownItem>
      ))}

      <DropdownDivider />

      <DropdownItem onClick={close} destructive>
        <LogOut className="h-4 w-4" />
        <span>{t('header.logout')}</span>
      </DropdownItem>
    </Dropdown>
  )
}
