import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'

// Mock environment variables for tests
Object.defineProperty(window, 'import.meta', {
  value: {
    env: {
      VITE_FUNKIT_API_KEY: 'test_funkit_api_key_fake_for_testing_only',
      VITE_FUNKIT_API_BASE_URL: 'https://api.fun.xyz/v1',
      DEV: true,
      PROD: false,
      MODE: 'test',
      BASE_URL: '/',
      SSR: false,
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