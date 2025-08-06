import { useState, useCallback } from 'react'

/**
 * Options for the clipboard hook
 */
export interface UseClipboardOptions {
  /**
   * Duration in milliseconds to show the copied state
   * @default 2000
   */
  timeout?: number
  /**
   * Callback function called on successful copy
   */
  onSuccess?: () => void
  /**
   * Callback function called on copy error
   */
  onError?: (error: Error) => void
}

/**
 * Return type for the clipboard hook
 */
export interface UseClipboardReturn {
  /**
   * Whether the text was recently copied
   */
  copied: boolean
  /**
   * Function to copy text to clipboard
   */
  copy: (text: string) => Promise<void>
  /**
   * Function to manually reset the copied state
   */
  reset: () => void
}

/**
 * Custom hook for copying text to clipboard with visual feedback
 * @param options - Configuration options for the hook
 * @returns Object with copied state and copy function
 */
export const useClipboard = (options: UseClipboardOptions = {}): UseClipboardReturn => {
  const { timeout = 2000, onSuccess, onError } = options
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string): Promise<void> => {
      try {
        if (typeof window === 'undefined' || !window.navigator?.clipboard) {
          throw new Error('Clipboard API is not available')
        }
        await window.navigator.clipboard.writeText(text)
        setCopied(true)
        onSuccess?.()

        // Reset copied state after timeout
        setTimeout(() => setCopied(false), timeout)
      } catch (error) {
        const clipboardError =
          error instanceof Error ? error : new Error('Failed to copy to clipboard')
        onError?.(clipboardError)
        console.error('Failed to copy to clipboard:', clipboardError)
      }
    },
    [timeout, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setCopied(false)
  }, [])

  return { copied, copy, reset }
}

/**
 * Simple version of clipboard hook with default options
 * @returns Object with copied state and copy function
 */
export const useSimpleClipboard = (): UseClipboardReturn => {
  return useClipboard()
}
