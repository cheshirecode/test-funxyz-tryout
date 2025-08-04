// Theme management using Jotai atoms
import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import {
  themeAtom,
  toggleThemeAtom,
  setThemeAtom,
  applyThemeAtom,
  syncSystemThemeAtom,
  isDarkThemeAtom,
  type Theme,
} from '@state/atoms/themeAtoms'

interface UseThemeReturn {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/**
 * Custom hook for theme management using Jotai atoms
 * Automatically applies theme changes to the document and handles system preference syncing
 */
export const useTheme = (): UseThemeReturn => {
  const [theme] = useAtom(themeAtom)
  const [isDark] = useAtom(isDarkThemeAtom)
  const setTheme = useSetAtom(setThemeAtom)
  const toggleTheme = useSetAtom(toggleThemeAtom)
  const applyTheme = useSetAtom(applyThemeAtom)
  const syncSystemTheme = useSetAtom(syncSystemThemeAtom)

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme()
  }, [theme, applyTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      syncSystemTheme()
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [syncSystemTheme])

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  }
}

// Export the Theme type for convenience
export type { Theme }
