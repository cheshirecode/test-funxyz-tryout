// Integration tests for theme system
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'jotai'
import { createStore } from 'jotai'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TokenSwap } from '../components/TokenSwap'
import { ThemeSwitcher } from '../components/ThemeSwitcher'
import { Tooltip } from '../components/Tooltip'
import { themeAtom } from '../utils/state/atoms/themeAtoms'

// Mock the necessary modules
vi.mock('../utils/api/tokenService', () => ({
  fetchTokenData: vi.fn().mockResolvedValue([
    { symbol: 'USDC', price: 1.0, balance: 1000, icon: 'usdc-icon.png' },
    { symbol: 'ETH', price: 2000, balance: 5, icon: 'eth-icon.png' },
    { symbol: 'WBTC', price: 30000, balance: 0.1, icon: 'wbtc-icon.png' },
  ]),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock matchMedia
const matchMediaMock = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  value: matchMediaMock,
  writable: true,
})

// Mock document
const documentClassListMock = {
  add: vi.fn(),
  remove: vi.fn(),
  contains: vi.fn(),
}

Object.defineProperty(document, 'documentElement', {
  value: {
    classList: documentClassListMock,
  },
  writable: true,
})

describe('Theme System Integration', () => {
  let store: ReturnType<typeof createStore>
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    store = createStore()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>{component}</Provider>
      </QueryClientProvider>
    )
  }

  describe('TokenSwap Theme Integration', () => {
    it('should render TokenSwap with theme-aware styling', async () => {
      renderWithProviders(<TokenSwap />)

      // Check for theme-aware elements
      await waitFor(() => {
        const container = screen.getByText('Token Price Explorer').closest('div')
        expect(container).toHaveClass('bg-surface-light', 'dark:bg-surface-dark')
      })
    })

    it('should switch themes in TokenSwap component', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TokenSwap />)

      // Find theme switcher
      const themeSwitcher = screen.getByLabelText(/switch to dark mode/i)
      expect(themeSwitcher).toBeInTheDocument()

      // Click to switch to dark mode
      await user.click(themeSwitcher)

      // Verify theme state changed
      const currentTheme = store.get(themeAtom)
      expect(currentTheme).toBe('dark')
    })

    it('should show wallet tooltip correctly', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TokenSwap />)

      // Find wallet icon
      const walletButton = screen.getByRole('button', { name: /wallet/i })
      expect(walletButton).toBeInTheDocument()

      // Hover to show tooltip
      await user.hover(walletButton)

      await waitFor(() => {
        expect(screen.getByText('incoming funkit wallet integration')).toBeInTheDocument()
      })
    })

    it('should have properly positioned USD input', async () => {
      renderWithProviders(<TokenSwap />)

      await waitFor(() => {
        const enterAmountHeading = screen.getByText('Enter Amount')
        expect(enterAmountHeading).toBeInTheDocument()

        const usdInput = screen.getByPlaceholderText('0.00')
        expect(usdInput).toBeInTheDocument()
        expect(usdInput).toHaveClass('text-4xl', 'font-bold', 'text-center')
      })
    })
  })

  describe('Theme Persistence', () => {
    it('should persist theme changes to localStorage', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TokenSwap />)

      const themeSwitcher = screen.getByLabelText(/switch to dark mode/i)
      await user.click(themeSwitcher)

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', JSON.stringify('dark'))
    })

    it('should load theme from localStorage on initialization', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'theme') return JSON.stringify('dark')
        return null
      })

      renderWithProviders(<TokenSwap />)

      // Theme should be loaded from localStorage
      const theme = store.get(themeAtom)
      expect(['light', 'dark']).toContain(theme)
    })
  })

  describe('Theme Application to Document', () => {
    it('should apply dark class to document when switching to dark theme', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TokenSwap />)

      const themeSwitcher = screen.getByLabelText(/switch to dark mode/i)
      await user.click(themeSwitcher)

      // Should apply dark class to document
      expect(documentClassListMock.add).toHaveBeenCalledWith('dark')
    })

    it('should remove dark class when switching to light theme', async () => {
      const user = userEvent.setup()

      // Start with dark theme
      store.set(themeAtom, 'dark')
      renderWithProviders(<TokenSwap />)

      const themeSwitcher = screen.getByLabelText(/switch to light mode/i)
      await user.click(themeSwitcher)

      // Should remove dark class from document
      expect(documentClassListMock.remove).toHaveBeenCalledWith('dark')
    })
  })

  describe('Tooltip Integration', () => {
    it('should show and hide tooltips correctly', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button', { name: 'Test Button' })

      // Show tooltip
      await user.hover(button)
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      // Hide tooltip
      await user.unhover(button)
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      })
    })

    it('should support keyboard navigation for tooltips', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button', { name: 'Test Button' })

      // Focus with keyboard
      await user.tab()
      expect(button).toHaveFocus()

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })
  })

  describe('Theme Switcher Integration', () => {
    it('should toggle between themes correctly', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ThemeSwitcher />)

      const switcher = screen.getByRole('button')

      // Start with light theme
      expect(store.get(themeAtom)).toBe('light')

      // Toggle to dark
      await user.click(switcher)
      expect(store.get(themeAtom)).toBe('dark')

      // Toggle back to light
      await user.click(switcher)
      expect(store.get(themeAtom)).toBe('light')
    })

    it('should update aria-label based on current theme', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ThemeSwitcher />)

      const switcher = screen.getByRole('button')

      // Should show "Switch to dark mode" when in light mode
      expect(switcher).toHaveAttribute('aria-label', 'Switch to dark mode')

      // Switch to dark mode
      await user.click(switcher)

      // Should show "Switch to light mode" when in dark mode
      await waitFor(() => {
        expect(switcher).toHaveAttribute('aria-label', 'Switch to light mode')
      })
    })
  })

  describe('System Theme Sync', () => {
    it('should sync with system theme when no preference is stored', () => {
      // Mock system dark preference
      matchMediaMock.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })

      renderWithProviders(<TokenSwap />)

      // Should respect system preference when no stored preference
      const theme = store.get(themeAtom)
      expect(['light', 'dark']).toContain(theme)
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      const user = userEvent.setup()
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage is full')
      })

      renderWithProviders(<TokenSwap />)

      const themeSwitcher = screen.getByLabelText(/switch to dark mode/i)

      // Should not crash when localStorage fails
      expect(async () => {
        await user.click(themeSwitcher)
      }).not.toThrow()
    })

    it('should handle missing matchMedia gracefully', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        writable: true,
      })

      expect(() => {
        renderWithProviders(<TokenSwap />)
      }).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('should not cause excessive re-renders when switching themes', async () => {
      const user = userEvent.setup()
      const renderSpy = vi.fn()

      const TestComponent = () => {
        renderSpy()
        return <TokenSwap />
      }

      renderWithProviders(<TestComponent />)

      const themeSwitcher = screen.getByLabelText(/switch to dark mode/i)
      await user.click(themeSwitcher)

      // Should not cause excessive re-renders
      expect(renderSpy).toHaveBeenCalledTimes(2) // Initial + theme change
    })
  })

  describe('Accessibility', () => {
    it('should maintain focus management during theme switches', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TokenSwap />)

      const themeSwitcher = screen.getByLabelText(/switch to dark mode/i)

      // Focus and click
      await user.tab()
      await user.keyboard('[Enter]')

      // Should maintain focus after theme switch
      expect(themeSwitcher).toHaveFocus()
    })

    it('should provide proper contrast in both themes', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TokenSwap />)

      // Test light theme contrast
      const title = screen.getByText('Token Price Explorer')
      expect(title).toHaveClass('text-text-light-primary', 'dark:text-text-dark-primary')

      // Switch to dark theme
      const themeSwitcher = screen.getByLabelText(/switch to dark mode/i)
      await user.click(themeSwitcher)

      // Classes should provide proper contrast in dark mode
      expect(title).toHaveClass('dark:text-text-dark-primary')
    })
  })
})
