import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../utils/hooks/ui/useTheme'

interface ThemeSwitcherProps {
  className?: string
}

export const ThemeSwitcher = ({ className = '' }: ThemeSwitcherProps) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type='button'
    >
      {theme === 'light' ? (
        <Moon size={20} className='text-neutral-600 dark:text-neutral-400' />
      ) : (
        <Sun size={20} className='text-neutral-600 dark:text-neutral-400' />
      )}
    </button>
  )
}
