import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useClipboard, useSimpleClipboard } from '../useClipboard'

// Mock navigator.clipboard
const mockWriteText = vi.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

describe('useClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('basic functionality', () => {
    it('should initialize with copied as false', () => {
      const { result } = renderHook(() => useClipboard())

      expect(result.current.copied).toBe(false)
      expect(typeof result.current.copy).toBe('function')
      expect(typeof result.current.reset).toBe('function')
    })

    it('should copy text successfully and set copied to true', async () => {
      mockWriteText.mockResolvedValue(undefined)
      const { result } = renderHook(() => useClipboard())

      await act(async () => {
        await result.current.copy('test text')
      })

      expect(mockWriteText).toHaveBeenCalledWith('test text')
      expect(result.current.copied).toBe(true)
    })

    it('should reset copied state after timeout', async () => {
      mockWriteText.mockResolvedValue(undefined)
      const { result } = renderHook(() => useClipboard({ timeout: 1000 }))

      await act(async () => {
        await result.current.copy('test text')
      })

      expect(result.current.copied).toBe(true)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.copied).toBe(false)
    })

    it('should handle copy errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Clipboard API not available')
      mockWriteText.mockRejectedValue(error)

      const { result } = renderHook(() => useClipboard())

      await act(async () => {
        await result.current.copy('test text')
      })

      expect(result.current.copied).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy to clipboard:', error)

      consoleErrorSpy.mockRestore()
    })

    it('should manually reset copied state', async () => {
      mockWriteText.mockResolvedValue(undefined)
      const { result } = renderHook(() => useClipboard())

      await act(async () => {
        await result.current.copy('test text')
      })

      expect(result.current.copied).toBe(true)

      act(() => {
        result.current.reset()
      })

      expect(result.current.copied).toBe(false)
    })
  })

  describe('with options', () => {
    it('should call onSuccess callback on successful copy', async () => {
      mockWriteText.mockResolvedValue(undefined)
      const onSuccess = vi.fn()
      const { result } = renderHook(() => useClipboard({ onSuccess }))

      await act(async () => {
        await result.current.copy('test text')
      })

      expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    it('should call onError callback on copy failure', async () => {
      const error = new Error('Clipboard API not available')
      mockWriteText.mockRejectedValue(error)
      const onError = vi.fn()

      const { result } = renderHook(() => useClipboard({ onError }))

      await act(async () => {
        await result.current.copy('test text')
      })

      expect(onError).toHaveBeenCalledWith(error)
    })

    it('should use custom timeout', async () => {
      mockWriteText.mockResolvedValue(undefined)
      const { result } = renderHook(() => useClipboard({ timeout: 500 }))

      await act(async () => {
        await result.current.copy('test text')
      })

      expect(result.current.copied).toBe(true)

      act(() => {
        vi.advanceTimersByTime(400)
      })

      expect(result.current.copied).toBe(true)

      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(result.current.copied).toBe(false)
    })

    it('should handle non-Error objects in catch block', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockWriteText.mockRejectedValue('string error')
      const onError = vi.fn()

      const { result } = renderHook(() => useClipboard({ onError }))

      await act(async () => {
        await result.current.copy('test text')
      })

      expect(onError).toHaveBeenCalledWith(expect.any(Error))
      expect(onError.mock.calls[0][0].message).toBe('Failed to copy to clipboard')

      consoleErrorSpy.mockRestore()
    })
  })

  describe('useSimpleClipboard', () => {
    it('should work with default options', async () => {
      mockWriteText.mockResolvedValue(undefined)
      const { result } = renderHook(() => useSimpleClipboard())

      await act(async () => {
        await result.current.copy('simple test')
      })

      expect(mockWriteText).toHaveBeenCalledWith('simple test')
      expect(result.current.copied).toBe(true)
    })
  })

  describe('multiple copy operations', () => {
    it('should handle rapid copy operations correctly', async () => {
      mockWriteText.mockResolvedValue(undefined)
      const { result } = renderHook(() => useClipboard({ timeout: 1000 }))

      await act(async () => {
        await result.current.copy('text 1')
      })

      expect(result.current.copied).toBe(true)

      act(() => {
        vi.advanceTimersByTime(500)
      })

      await act(async () => {
        await result.current.copy('text 2')
      })

      expect(result.current.copied).toBe(true)
      expect(mockWriteText).toHaveBeenCalledTimes(2)
      expect(mockWriteText).toHaveBeenLastCalledWith('text 2')
    })
  })
})