// Theme-related atoms with localStorage persistence
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type Theme = 'light' | 'dark'

// Helper function to get system theme preference
const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

// Helper function to get initial theme (system preference or stored preference)
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'

  // Check localStorage first
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored && ['light', 'dark'].includes(stored)) {
    return stored
  }

  // Fall back to system preference
  return getSystemTheme()
}

// Persisted atom for theme preference
export const themeAtom = atomWithStorage<Theme>('theme', getInitialTheme())

// Derived atom to check if current theme is dark
export const isDarkThemeAtom = atom((get) => get(themeAtom) === 'dark')

// Write-only atom to toggle theme
export const toggleThemeAtom = atom(null, (get, set) => {
  const currentTheme = get(themeAtom)
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'
  set(themeAtom, newTheme)
})

// Write-only atom to apply theme to document
export const applyThemeAtom = atom(null, (get, _set) => {
  const theme = get(themeAtom)

  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})

// Write-only atom to set specific theme
export const setThemeAtom = atom(null, (_get, set, newTheme: Theme) => {
  set(themeAtom, newTheme)
  set(applyThemeAtom)
})

// Derived atom for system theme preference monitoring
export const systemThemeAtom = atom<Theme>(getSystemTheme())

// Write-only atom to sync with system theme if no preference is stored
export const syncSystemThemeAtom = atom(null, (_get, set) => {
  // Only sync if user hasn't explicitly set a preference
  const stored = localStorage.getItem('theme')
  if (!stored) {
    const systemTheme = getSystemTheme()
    set(themeAtom, systemTheme)
    set(applyThemeAtom)
  }
})
