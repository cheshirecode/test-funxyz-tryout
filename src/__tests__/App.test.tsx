import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../App'

// Mock the API service with real @funkit/api-base methods
vi.mock('../services/api', () => ({
  apiService: {
    getFunkitUserInfo: vi.fn().mockResolvedValue({
      success: false,
      error: 'Test environment - @funkit/api-base not configured',
      fallbackInfo: {
        message: 'Real @funkit/api-base getUserUniqueId() integration',
        apiFunction: 'getUserUniqueId()',
        description: 'Attempts to get unique user identifier from funkit platform'
      },
      timestamp: new Date().toISOString()
    }),
    getFunkitAPIDemo: vi.fn().mockResolvedValue({
      success: false,
      error: 'Test environment - @funkit/api-base not configured',
      fallbackInfo: {
        message: 'Real @funkit/api-base integration configured',
        availableFunctions: [
          'getUserUniqueId()',
          'getGroups()',
          'getUserWalletIdentities()',
          'getAllowedAssets()',
          'getAssetPriceInfo()',
          'getChainFromId()',
          'createUser()'
        ],
        configuration: {
          apiKey: 'test_api...',
          baseUrl: 'https://api.test.example.com',
          funkitApiBaseUrl: 'https://api.fun.xyz/v1'
        }
      },
      timestamp: new Date().toISOString()
    }),
    getFunkitUserWallets: vi.fn().mockResolvedValue({
      success: false,
      error: 'Test environment - @funkit/api-base not configured',
      fallbackInfo: {
        message: 'Real @funkit/api-base getUserWalletIdentities() integration',
        apiFunction: 'getUserWalletIdentities()',
        description: 'Attempts to get user wallet identities from funkit platform'
      },
      timestamp: new Date().toISOString()
    })
  }
}))

// Mock the config
vi.mock('../config/api', () => ({
  apiConfig: {
    apiKey: 'test_api_key_12345',
    baseUrl: 'https://api.test.example.com',
    timeout: 10000
  },
  isDevelopment: true
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Navigation and Routing', () => {
    it('renders the navigation header', () => {
      renderWithProviders(<App />)
      expect(screen.getByText('React App')).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Demo')).toBeInTheDocument()
    })

    it('renders home page by default', () => {
      renderWithProviders(<App />)
      expect(screen.getByText('Welcome to React App')).toBeInTheDocument()
      expect(screen.getByText('A modern React application with routing')).toBeInTheDocument()
      expect(screen.getByText('View Demo')).toBeInTheDocument()
    })

    it('navigates to demo page when demo link is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)

      const demoLink = screen.getByText('Demo')
      await user.click(demoLink)

      await waitFor(() => {
        expect(screen.getByText('React + Vite + Tailwind 4 Demo')).toBeInTheDocument()
      })
    })

    it('navigates to demo page when View Demo button is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)

      const viewDemoButton = screen.getByText('View Demo')
      await user.click(viewDemoButton)

      await waitFor(() => {
        expect(screen.getByText('React + Vite + Tailwind 4 Demo')).toBeInTheDocument()
      })
    })
  })

  describe('Demo Page Functionality', () => {
    // Helper to navigate to demo page
    const navigateToDemoPage = async () => {
      const user = userEvent.setup()
      const viewDemoButton = screen.getByText('View Demo')
      await user.click(viewDemoButton)

      await waitFor(() => {
        expect(screen.getByText('React + Vite + Tailwind 4 Demo')).toBeInTheDocument()
      })
    }

    describe('Counter Functionality', () => {
      it('displays initial counter value of 0', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        expect(screen.getByText('0')).toBeInTheDocument()
      })

      it('increments counter when + button is clicked', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)
        await navigateToDemoPage()

        const incrementButton = screen.getByText('+')
        await user.click(incrementButton)

        expect(screen.getByText('1')).toBeInTheDocument()
      })

      it('decrements counter when - button is clicked', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)
        await navigateToDemoPage()

        const decrementButton = screen.getByText('-')
        await user.click(decrementButton)

        expect(screen.getByText('-1')).toBeInTheDocument()
      })
    })

    describe('React Query Integration (@funkit/api-base)', () => {
      it('displays loading state initially', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0)
      })

      it('displays funkit user info API result', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        await waitFor(() => {
          expect(screen.getByText('Real @funkit/api-base getUserUniqueId() integration')).toBeInTheDocument()
        }, { timeout: 3000 })
      })
    })

    describe('Funkit API Integration Demo', () => {
      it('shows funkit API configuration', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        await waitFor(() => {
          expect(screen.getByText('Environment Configuration')).toBeInTheDocument()
          expect(screen.getByText('Development')).toBeInTheDocument()
        })
      })

      it('displays funkit API demo results', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        await waitFor(() => {
          expect(screen.getByText('Real @funkit/api-base integration configured')).toBeInTheDocument()
        }, { timeout: 3000 })
      })

      it('shows available funkit functions', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        await waitFor(() => {
          expect(screen.getByText('getUserUniqueId()')).toBeInTheDocument()
          expect(screen.getByText('getGroups()')).toBeInTheDocument()
          expect(screen.getByText('getUserWalletIdentities()')).toBeInTheDocument()
          expect(screen.getByText('getAllowedAssets()')).toBeInTheDocument()
        }, { timeout: 3000 })
      })

      it('has refresh button for API demo', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)
        await navigateToDemoPage()

        const refreshButton = screen.getByText('Refresh Funkit API')
        expect(refreshButton).toBeInTheDocument()

        await user.click(refreshButton)
        // Button should be clickable (we're not testing the actual refresh here)
      })
    })

    describe('Headless UI Tabs', () => {
      it('displays tabs correctly', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Settings')).toBeInTheDocument()
        expect(screen.getByText('About')).toBeInTheDocument()
      })

      it('shows dashboard content by default', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        expect(screen.getByText('Welcome to the dashboard!')).toBeInTheDocument()
      })

      it('switches to settings tab when clicked', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)
        await navigateToDemoPage()

        const settingsTab = screen.getByText('Settings')
        await user.click(settingsTab)

        await waitFor(() => {
          expect(screen.getByText('Settings configuration panel')).toBeInTheDocument()
        })
      })

      it('switches to about tab when clicked', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)
        await navigateToDemoPage()

        const aboutTab = screen.getByText('About')
        await user.click(aboutTab)

        await waitFor(() => {
          expect(screen.getByText('About this application')).toBeInTheDocument()
        })
      })
    })

    describe('Real @funkit/api-base Integration', () => {
      it('shows funkit API base URL configuration', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        await waitFor(() => {
          expect(screen.getByText('https://api.fun.xyz/v1')).toBeInTheDocument()
        }, { timeout: 3000 })
      })

      it('displays error state with fallback information', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        await waitFor(() => {
          expect(screen.getByText('Test environment - @funkit/api-base not configured')).toBeInTheDocument()
        }, { timeout: 3000 })
      })
    })
  })
})