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
    },
  },
})

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

// Mock window.matchMedia
const matchMediaMock = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  value: matchMediaMock,
  writable: true,
})

// Mock document.documentElement for theme application
const documentClassListMock = {
  add: vi.fn(),
  remove: vi.fn(),
  contains: vi.fn(),
  toggle: vi.fn(),
}

Object.defineProperty(document, 'documentElement', {
  value: {
    classList: documentClassListMock,
  },
  writable: true,
})

// Mock ResizeObserver for scroll fader tests
const ResizeObserverMock = vi.fn().mockImplementation((_callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

Object.defineProperty(window, 'ResizeObserver', {
  value: ResizeObserverMock,
  writable: true,
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
