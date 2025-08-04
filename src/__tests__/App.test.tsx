import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../App'

// Mock the API service
vi.mock('../services/api', () => ({
  apiService: {
    getAPIHealthCheck: vi.fn().mockResolvedValue({
      success: true,
      data: {
        message: 'Mock data from @funkit/api-base integration',
        apiKey: 'test_api...',
        baseUrl: 'https://api.test.example.com',
        features: [
          'Environment variable configuration',
          'Error handling and logging',
          'Request/response interceptors',
          'Timeout handling',
          'Authentication headers'
        ]
      },
      timestamp: new Date().toISOString()
    }),
    createPost: vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, title: 'Test Post', content: 'Test content', message: 'Mock post created' },
      timestamp: new Date().toISOString()
    })
  }
}))

// Mock the config
vi.mock('../config/api', () => ({
  apiConfig: {
    apiKey: 'demo_api_key_12345',
    baseUrl: 'https://api.funkit.example.com',
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

    it('navigates back to home from demo page', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)

      // First navigate to demo
      const viewDemoButton = screen.getByText('View Demo')
      await user.click(viewDemoButton)

      await waitFor(() => {
        expect(screen.getByText('React + Vite + Tailwind 4 Demo')).toBeInTheDocument()
      })

      // Then navigate back to home
      const homeLink = screen.getByText('Home')
      await user.click(homeLink)

      await waitFor(() => {
        expect(screen.getByText('Welcome to React App')).toBeInTheDocument()
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

    describe('Counter functionality', () => {
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

    describe('React Query integration', () => {
      it('displays loading state initially', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()
        expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0)
      })

      it('displays mock data after loading', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        await waitFor(() => {
          expect(screen.getByText('Hello from React Query!')).toBeInTheDocument()
        }, { timeout: 3000 })
      })
    })

    describe('API Integration Demo', () => {
      it('displays environment configuration', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        await waitFor(() => {
          expect(screen.getByText('Environment Configuration')).toBeInTheDocument()
          expect(screen.getByText(/Development/)).toBeInTheDocument()
          expect(screen.getByText(/https:\/\/api\.funkit\.example\.com/)).toBeInTheDocument()
          expect(screen.getByText(/demo_api\.\.\./)).toBeInTheDocument()
        })
      })

      it('displays API integration features', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        await waitFor(() => {
          expect(screen.getByText('Mock data from @funkit/api-base integration')).toBeInTheDocument()
          expect(screen.getByText('Environment variable configuration')).toBeInTheDocument()
          expect(screen.getByText('Error handling and logging')).toBeInTheDocument()
        })
      })

      it('has refresh button that works', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)
        await navigateToDemoPage()

        await waitFor(() => {
          const refreshButton = screen.getByText('Refresh')
          expect(refreshButton).toBeInTheDocument()
        })

        const refreshButton = screen.getByText('Refresh')
        await user.click(refreshButton)
        expect(refreshButton).toBeInTheDocument()
      })
    })

    describe('Create Post functionality', () => {
      it('renders create post form', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        expect(screen.getByLabelText('Title')).toBeInTheDocument()
        expect(screen.getByLabelText('Content')).toBeInTheDocument()
        expect(screen.getByText('Create Post')).toBeInTheDocument()
      })

      it('initially disables submit button when form is empty', async () => {
        renderWithProviders(<App />)
        await navigateToDemoPage()

        const submitButton = screen.getByText('Create Post')
        expect(submitButton).toBeDisabled()
      })

      it('enables submit button when form is filled', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)
        await navigateToDemoPage()

        const titleInput = screen.getByLabelText('Title')
        const contentInput = screen.getByLabelText('Content')
        const submitButton = screen.getByText('Create Post')

        await user.type(titleInput, 'Test Title')
        await user.type(contentInput, 'Test Content')

        expect(submitButton).not.toBeDisabled()
      })

      it('submits form and shows success message', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)
        await navigateToDemoPage()

        const titleInput = screen.getByLabelText('Title')
        const contentInput = screen.getByLabelText('Content')
        const submitButton = screen.getByText('Create Post')

        await user.type(titleInput, 'Test Title')
        await user.type(contentInput, 'Test Content')
        await user.click(submitButton)

        await waitFor(() => {
          expect(screen.getByText('Post created successfully!')).toBeInTheDocument()
        })

        // Form should be cleared
        expect(titleInput).toHaveValue('')
        expect(contentInput).toHaveValue('')
      })
    })

    describe('Headless UI Tabs', () => {
      it('renders all tab buttons', async () => {
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
        expect(screen.getByText('Configure your application settings here.')).toBeInTheDocument()
      })

      it('switches to about tab when clicked', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)
        await navigateToDemoPage()

        const aboutTab = screen.getByText('About')
        await user.click(aboutTab)
        expect(screen.getByText('Built with React 18, Vite, Tailwind 4, Headless UI, and React Query.')).toBeInTheDocument()
      })
    })
  })
})