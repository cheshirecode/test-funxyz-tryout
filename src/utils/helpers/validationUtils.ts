// Validation utility functions for swap operations
import type { TokenData } from '@types'

/**
 * Check if there's insufficient balance for the swap
 */
export function hasInsufficientBalance(
  sourceTokenAmount: string,
  sourceToken: string,
  tokenData: Record<string, TokenData>
): boolean {
  if (!sourceTokenAmount || isNaN(parseFloat(sourceTokenAmount))) return false
  return parseFloat(sourceTokenAmount) > (tokenData[sourceToken]?.balance || 0)
}

/**
 * Validate USD amount input
 */
export function isValidUsdAmount(usdAmount: string): boolean {
  if (!usdAmount) return false
  const amount = parseFloat(usdAmount)
  return !isNaN(amount) && amount > 0
}

/**
 * Validate token amount input
 */
export function isValidTokenAmount(tokenAmount: string): boolean {
  if (!tokenAmount) return false
  const amount = parseFloat(tokenAmount)
  return !isNaN(amount) && amount >= 0
}

/**
 * Check if swap is valid (all conditions met)
 */
export function isSwapValid(
  usdAmount: string,
  sourceTokenAmount: string,
  sourceToken: string,
  tokenData: Record<string, TokenData>,
  isSwapping: boolean
): boolean {
  return (
    isValidUsdAmount(usdAmount) &&
    !hasInsufficientBalance(sourceTokenAmount, sourceToken, tokenData) &&
    !isSwapping
  )
}

/**
 * Get validation error message
 */
export function getValidationError(
  usdAmount: string,
  sourceTokenAmount: string,
  sourceToken: string,
  tokenData: Record<string, TokenData>
): string | null {
  if (!isValidUsdAmount(usdAmount)) {
    return 'Please enter a valid USD amount'
  }

  if (hasInsufficientBalance(sourceTokenAmount, sourceToken, tokenData)) {
    return `Insufficient ${sourceToken} balance`
  }

  return null
}
