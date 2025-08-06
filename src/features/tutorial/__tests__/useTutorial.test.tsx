import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTutorial } from '../useTutorial'

// Mock the tutorial data
vi.mock('../data', () => ({
  tutorialSteps: [
    {
      id: 'test-step',
      title: 'Test Step',
      description: 'Test description',
      targetSelector: '[data-tutorial="test"]',
      position: 'bottom' as const,
    },
  ],
}))

describe('useTutorial', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock document.querySelector
    document.querySelector = vi.fn().mockReturnValue({
      getBoundingClientRect: () => ({
        top: 100,
        left: 100,
        width: 200,
        height: 50,
        bottom: 150,
        right: 300,
      }),
    })
    // Mock window properties
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should close tutorial when escape key is pressed', () => {
    const { result } = renderHook(() => useTutorial(true, mockOnClose))

    // Start the tutorial
    act(() => {
      result.current.handleStart()
    })

    expect(result.current.isActive).toBe(true)

    // Simulate escape key press
    act(() => {
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
      })
      document.dispatchEvent(escapeEvent)
    })

    expect(mockOnClose).toHaveBeenCalled()
    expect(result.current.isActive).toBe(false)
  })

  it('should close tutorial when escape key is pressed in welcome screen', () => {
    const { result } = renderHook(() => useTutorial(true, mockOnClose))

    // Tutorial is open but not active (welcome screen)
    expect(result.current.isActive).toBe(false)

    // Simulate escape key press
    act(() => {
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
      })
      document.dispatchEvent(escapeEvent)
    })

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should not respond to escape key when tutorial is closed', () => {
    const { result } = renderHook(() => useTutorial(false, mockOnClose))

    // Tutorial is closed
    expect(result.current.isActive).toBe(false)

    // Simulate escape key press
    act(() => {
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
      })
      document.dispatchEvent(escapeEvent)
    })

    // Should not call onClose since tutorial is already closed
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should not respond to other keys', () => {
    const { result } = renderHook(() => useTutorial(true, mockOnClose))

    // Start the tutorial
    act(() => {
      result.current.handleStart()
    })

    expect(result.current.isActive).toBe(true)

    // Simulate other key press (Enter)
    act(() => {
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
      })
      document.dispatchEvent(enterEvent)
    })

    // Should not close the tutorial
    expect(mockOnClose).not.toHaveBeenCalled()
    expect(result.current.isActive).toBe(true)
  })
})