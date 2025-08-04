import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../App'

// Mock the API service
vi.mock('../services/api', () => ({
  apiService: {
    getMockData: vi.fn().mockResolvedValue({
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

  it('renders the main heading', () => {
    renderWithProviders(<App />)
    expect(screen.getByText('React + Vite + Tailwind 4')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    renderWithProviders(<App />)
    expect(screen.getByText('Modern React development stack with Headless UI and React Query')).toBeInTheDocument()
  })

  describe('Counter functionality', () => {
    it('displays initial counter value of 0', () => {
      renderWithProviders(<App />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('increments counter when + button is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)

      const incrementButton = screen.getByText('+')
      await user.click(incrementButton)

      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('decrements counter when - button is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)

      const decrementButton = screen.getByText('-')
      await user.click(decrementButton)

      expect(screen.getByText('-1')).toBeInTheDocument()
    })

    it('can increment and decrement multiple times', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)

      const incrementButton = screen.getByText('+')
      const decrementButton = screen.getByText('-')

      await user.click(incrementButton)
      await user.click(incrementButton)
      await user.click(incrementButton)
      expect(screen.getByText('3')).toBeInTheDocument()

      await user.click(decrementButton)
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  describe('React Query integration', () => {
    it('displays loading state initially', () => {
      renderWithProviders(<App />)
      expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0)
    })

    it('displays mock data after loading', async () => {
      renderWithProviders(<App />)

      await waitFor(() => {
        expect(screen.getByText('Hello from React Query!')).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('API Integration Demo', () => {
    it('displays environment configuration', async () => {
      renderWithProviders(<App />)

      await waitFor(() => {
        expect(screen.getByText('Environment Configuration')).toBeInTheDocument()
        expect(screen.getByText(/Development/)).toBeInTheDocument()
        expect(screen.getByText(/https:\/\/api\.funkit\.example\.com/)).toBeInTheDocument()
        expect(screen.getByText(/demo_api\.\.\./)).toBeInTheDocument()
      })
    })

    it('displays API integration features', async () => {
      renderWithProviders(<App />)

      await waitFor(() => {
        expect(screen.getByText('Mock data from @funkit/api-base integration')).toBeInTheDocument()
        expect(screen.getByText('Environment variable configuration')).toBeInTheDocument()
        expect(screen.getByText('Error handling and logging')).toBeInTheDocument()
      })
    })

    it('has refresh button that works', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)

      await waitFor(() => {
        const refreshButton = screen.getByText('Refresh')
        expect(refreshButton).toBeInTheDocument()
      })

      const refreshButton = screen.getByText('Refresh')
      await user.click(refreshButton)

      // Button should be clickable
      expect(refreshButton).toBeInTheDocument()
    })
  })

  describe('Create Post functionality', () => {
    it('renders create post form', () => {
      renderWithProviders(<App />)

      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Content')).toBeInTheDocument()
      expect(screen.getByText('Create Post')).toBeInTheDocument()
    })

    it('initially disables submit button when form is empty', () => {
      renderWithProviders(<App />)

      const submitButton = screen.getByText('Create Post')
      expect(submitButton).toBeDisabled()
    })

    it('enables submit button when form is filled', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)

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
    it('renders all tab buttons', () => {
      renderWithProviders(<App />)

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
    })

    it('shows dashboard content by default', () => {
      renderWithProviders(<App />)

      expect(screen.getByText('Welcome to the dashboard!')).toBeInTheDocument()
    })

    it('switches to settings tab when clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)

      const settingsTab = screen.getByText('Settings')
      await user.click(settingsTab)

      expect(screen.getByText('Configure your application settings here.')).toBeInTheDocument()
    })

    it('switches to about tab when clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<App />)

      const aboutTab = screen.getByText('About')
      await user.click(aboutTab)

      expect(screen.getByText('Built with React 18, Vite, Tailwind 4, Headless UI, and React Query.')).toBeInTheDocument()
    })
  })
})