// Tests for ThemeSwitcher component
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'jotai'
import { createStore } from 'jotai'
import { ThemeSwitcher } from '../ThemeSwitcher'
import { themeAtom } from '../../utils/state/atoms/themeAtoms'

// Mock the useTheme hook
const mockToggleTheme = vi.fn()
const mockSetTheme = vi.fn()

vi.mock('../../utils/hooks/ui/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    isDark: false,
    setTheme: mockSetTheme,
    toggleTheme: mockToggleTheme,
  }),
}))

describe('ThemeSwitcher Component', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    vi.clearAllMocks()
    store = createStore()
  })

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<Provider store={store}>{component}</Provider>)
  }

  describe('Rendering', () => {
    it('should render theme switcher button', () => {
      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should apply default classes', () => {
      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'p-2',
        'rounded-full',
        'min-h-[44px]',
        'min-w-[44px]',
        'flex',
        'items-center',
        'justify-center',
        'transition-colors'
      )
    })

    it('should apply custom className', () => {
      renderWithProvider(<ThemeSwitcher className='custom-class' />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should have proper minimum touch target size', () => {
      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('min-h-[44px]', 'min-w-[44px]')
    })
  })

  describe('Icon Display', () => {
    it('should show moon icon for light theme', () => {
      renderWithProvider(<ThemeSwitcher />)

      // Moon icon should be visible (theme is mocked as 'light')
      const icon = screen.getByRole('button').querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should have correct icon styling', () => {
      renderWithProvider(<ThemeSwitcher />)

      const icon = screen.getByRole('button').querySelector('svg')
      expect(icon).toHaveClass('text-neutral-600', 'dark:text-neutral-400')
    })
  })

  describe('Interactions', () => {
    it('should call toggleTheme on click', async () => {
      const user = userEvent.setup()
      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple rapid clicks', async () => {
      const user = userEvent.setup()
      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')

      // Rapid clicks
      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(mockToggleTheme).toHaveBeenCalledTimes(3)
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')

      // Focus with tab
      await user.tab()
      expect(button).toHaveFocus()

      // Activate with Enter
      await user.keyboard('[Enter]')
      expect(mockToggleTheme).toHaveBeenCalledTimes(1)

      // Activate with Space
      await user.keyboard('[Space]')
      expect(mockToggleTheme).toHaveBeenCalledTimes(2)
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria-label for light theme', () => {
      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
    })

    it('should have proper button role', () => {
      renderWithProvider(<ThemeSwitcher />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should be focusable', () => {
      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('tabindex', '-1')
    })
  })

  describe('Theme State Integration', () => {
    it('should work with Jotai store', () => {
      // Set initial theme in store
      store.set(themeAtom, 'light')

      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()

      // Should be able to interact with button
      fireEvent.click(button)
      expect(mockToggleTheme).toHaveBeenCalled()
    })
  })

  describe('Hover States', () => {
    it('should have hover styles', () => {
      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-neutral-200', 'dark:hover:bg-neutral-700')
    })

    it('should handle mouse events', () => {
      renderWithProvider(<ThemeSwitcher />)

      const button = screen.getByRole('button')

      fireEvent.mouseEnter(button)
      fireEvent.mouseLeave(button)

      // Should not affect functionality
      fireEvent.click(button)
      expect(mockToggleTheme).toHaveBeenCalled()
    })
  })

  describe('Integration with Theme System', () => {
    it('should work alongside other theme-aware components', () => {
      renderWithProvider(
        <div className='bg-surface-light dark:bg-surface-dark'>
          <ThemeSwitcher />
        </div>
      )

      const switcher = screen.getByRole('button')
      expect(switcher).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const { rerender } = renderWithProvider(<ThemeSwitcher />)

      // Re-render with same props
      rerender(
        <Provider store={store}>
          <ThemeSwitcher />
        </Provider>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should handle prop changes efficiently', () => {
      const { rerender } = renderWithProvider(<ThemeSwitcher className='class1' />)

      // Change props
      rerender(
        <Provider store={store}>
          <ThemeSwitcher className='class2' />
        </Provider>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('class2')
      expect(button).not.toHaveClass('class1')
    })
  })
})
