// Button state utility functions for UI styling
import { hasInsufficientBalance, isValidUsdAmount } from './validationUtils'
import type { TokenData, SwapButtonState } from '../types'

/**
 * Get swap button state based on current conditions
 */
export function getSwapButtonState(
  usdAmount: string,
  sourceTokenAmount: string,
  sourceToken: string,
  targetToken: string,
  tokenData: Record<string, TokenData>,
  swapping: boolean,
  swapComplete: boolean
): SwapButtonState {
  // Loading state
  if (swapping) {
    return {
      className: 'bg-primary-500 text-white cursor-not-allowed',
      disabled: true,
      text: 'Swapping...'
    }
  }

  // Success state
  if (swapComplete) {
    return {
      className: 'bg-success-500 text-white',
      disabled: false,
      text: 'Swap Successful'
    }
  }

  // Invalid amount
  if (!isValidUsdAmount(usdAmount)) {
    return {
      className: 'bg-gray-300 text-gray-500 cursor-not-allowed',
      disabled: true,
      text: `Swap ${sourceToken} to ${targetToken}`
    }
  }

  // Insufficient balance
  if (hasInsufficientBalance(sourceTokenAmount, sourceToken, tokenData)) {
    return {
      className: 'bg-error-500 text-white cursor-not-allowed',
      disabled: true,
      text: `Swap ${sourceToken} to ${targetToken}`
    }
  }

  // Valid state
  return {
    className: 'bg-primary-600 hover:bg-primary-700 text-white',
    disabled: false,
    text: `Swap ${sourceToken} to ${targetToken}`
  }
}

/**
 * Get balance text styling based on validation state
 */
export function getBalanceTextStyle(
  sourceTokenAmount: string,
  sourceToken: string,
  tokenData: Record<string, TokenData>
): string {
  if (hasInsufficientBalance(sourceTokenAmount, sourceToken, tokenData)) {
    return 'text-error-500'
  }
  return 'text-gray-500'
}