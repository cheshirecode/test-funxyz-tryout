import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../utils/hooks/ui/useTheme'
import { Tooltip } from './Tooltip'

interface ThemeSwitcherProps {
  className?: string
  'data-tutorial'?: string
}

export const ThemeSwitcher = ({
  className = '',
  'data-tutorial': dataTutorial,
}: ThemeSwitcherProps) => {
  const { theme, toggleTheme } = useTheme()

  const nextTheme = theme === 'light' ? 'dark' : 'light'
  const currentThemeCapitalized = theme.charAt(0).toUpperCase() + theme.slice(1)
  const nextThemeCapitalized = nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)

  const tooltipContent = `Currently: ${currentThemeCapitalized} theme. Click to switch to ${nextThemeCapitalized} theme`

  return (
    <Tooltip content={tooltipContent}>
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 ${className}`}
        aria-label={`Switch to ${nextTheme} mode`}
        type='button'
        data-tutorial={dataTutorial}
      >
        {theme === 'light' ? (
          <Moon size={20} className='text-neutral-600 dark:text-neutral-400' />
        ) : (
          <Sun size={20} className='text-neutral-600 dark:text-neutral-400' />
        )}
      </button>
    </Tooltip>
  )
}
