import '@testing-library/jest-dom'

// Mock environment variables for tests
Object.defineProperty(window, 'import.meta', {
  value: {
    env: {
      VITE_FUNKIT_API_KEY: 'test_api_key_12345',
      VITE_FUNKIT_API_BASE_URL: 'https://api.test.example.com',
      DEV: true,
      PROD: false,
    }
  }
})

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn
const originalConsoleLog = console.log

beforeEach(() => {
  // Reset console mocks before each test
  console.error = vi.fn()
  console.warn = vi.fn()
  console.log = vi.fn()
})

afterEach(() => {
  // Restore original console methods after each test
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
  console.log = originalConsoleLog
})