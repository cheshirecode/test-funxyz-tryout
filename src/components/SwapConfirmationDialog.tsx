import React from 'react'
import { X, ArrowDown } from 'lucide-react'
import type { TokenData } from '@types'

interface SwapConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  usdAmount: string
  sourceToken: string
  targetToken: string
  sourceTokenAmount: string
  targetTokenAmount: string
  tokenData: Record<string, TokenData>
  exchangeRate: number
  gasPrice?: {
    success: boolean
    data?: {
      gasPrice?: any
      chainId?: string
      gasPriceWei?: number
      gasPriceGwei?: number
      gasPriceEth?: number
      estimatedCosts?: {
        tokenSwap?: {
          gasLimit?: number
          costWei?: number
          costGwei?: number
          costEth?: number
        }
      }
    }
  }
  isLoading?: boolean
}

// Fallback image URL for when token icons fail to load
// Used due to rate-limiting from cryptologos.cc - provides generic crypto icon as fallback
const FALLBACK_ICON_URL =
  'https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png'

export const SwapConfirmationDialog: React.FC<SwapConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  usdAmount,
  sourceToken,
  targetToken,
  sourceTokenAmount,
  targetTokenAmount,
  tokenData,
  exchangeRate,
  gasPrice,
  isLoading = false,
}) => {
  if (!isOpen) return null

  const sourceTokenData = tokenData[sourceToken]
  const targetTokenData = tokenData[targetToken]

  // Calculate estimated gas fee in USD using tokenSwap costs
  const gasCostEth = gasPrice?.data?.estimatedCosts?.tokenSwap?.costEth || 0.00005 // Default ETH cost

  // Get ETH price to convert gas cost from ETH to USD
  const ethPrice =
    tokenData['ETH']?.usdPrice ||
    (sourceToken === 'ETH'
      ? tokenData[sourceToken]?.usdPrice
      : targetToken === 'ETH'
        ? tokenData[targetToken]?.usdPrice
        : 3500) // Default ETH price

  const estimatedGasFeeUsd = gasCostEth * ethPrice

  // Calculate total cost in USD (swap amount + gas fee)
  const totalCostUsd = parseFloat(usdAmount || '0') + estimatedGasFeeUsd

  // Handle image error with fallback
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.target as HTMLImageElement
    if (target.src !== FALLBACK_ICON_URL) {
      target.src = FALLBACK_ICON_URL
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 w-full max-w-md'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700'>
          <h2 className='text-xl font-semibold text-text-light-primary dark:text-text-dark-primary'>
            Confirm Swap
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
          >
            <X size={20} className='text-neutral-600 dark:text-neutral-400' />
          </button>
        </div>

        {/* Swap Summary */}
        <div className='p-6 space-y-4'>
          {/* USD Amount */}
          <div className='text-center'>
            <div className='text-2xl font-bold text-text-light-primary dark:text-text-dark-primary'>
              ${usdAmount}
            </div>
            <div className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
              Total Swap Amount
            </div>
          </div>

          {/* Token Swap Visual */}
          <div className='space-y-3'>
            {/* Source Token */}
            <div className='bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  {sourceTokenData?.icon && (
                    <img
                      src={sourceTokenData.icon}
                      alt={sourceToken}
                      className='w-8 h-8 rounded-full'
                      onError={handleImageError}
                    />
                  )}
                  <div>
                    <div className='font-medium text-text-light-primary dark:text-text-dark-primary'>
                      {sourceTokenData?.name || sourceToken}
                    </div>
                    <div className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                      {sourceToken}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-semibold text-text-light-primary dark:text-text-dark-primary'>
                    {parseFloat(sourceTokenAmount).toFixed(6)}
                  </div>
                  <div className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                    ${(parseFloat(sourceTokenAmount) * (sourceTokenData?.usdPrice || 0)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className='flex justify-center'>
              <div className='p-2 bg-primary-500 rounded-full'>
                <ArrowDown size={16} className='text-white' />
              </div>
            </div>

            {/* Target Token */}
            <div className='bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  {targetTokenData?.icon && (
                    <img
                      src={targetTokenData.icon}
                      alt={targetToken}
                      className='w-8 h-8 rounded-full'
                      onError={handleImageError}
                    />
                  )}
                  <div>
                    <div className='font-medium text-text-light-primary dark:text-text-dark-primary'>
                      {targetTokenData?.name || targetToken}
                    </div>
                    <div className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                      {targetToken}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-semibold text-text-light-primary dark:text-text-dark-primary'>
                    {parseFloat(targetTokenAmount).toFixed(6)}
                  </div>
                  <div className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                    ${(parseFloat(targetTokenAmount) * (targetTokenData?.usdPrice || 0)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Rate */}
          {exchangeRate > 0 && (
            <div className='bg-accent-light dark:bg-accent-dark/20 rounded-xl p-3'>
              <div className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                Exchange Rate
              </div>
              <div className='font-medium text-text-light-primary dark:text-text-dark-primary'>
                1 {sourceToken} = {exchangeRate.toFixed(6)} {targetToken}
              </div>
            </div>
          )}

          {/* Fees Summary */}
          <div className='space-y-2 border-t border-neutral-200 dark:border-neutral-700 pt-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-text-light-secondary dark:text-text-dark-secondary'>
                Swap Amount
              </span>
              <span className='text-text-light-primary dark:text-text-dark-primary'>
                ${usdAmount}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-text-light-secondary dark:text-text-dark-secondary'>
                Estimated Gas Fee
              </span>
              <span className='text-text-light-primary dark:text-text-dark-primary'>
                ${estimatedGasFeeUsd.toFixed(4)}
              </span>
            </div>
            <div className='flex justify-between font-semibold border-t border-neutral-200 dark:border-neutral-700 pt-2'>
              <span className='text-text-light-primary dark:text-text-dark-primary'>
                Total Cost
              </span>
              <span className='text-text-light-primary dark:text-text-dark-primary'>
                ${totalCostUsd.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Fallback Icon Notice */}
          <div className='text-xs text-text-light-secondary dark:text-text-dark-secondary text-center'>
            * Generic crypto icons may appear due to rate-limiting from cryptologos.cc
          </div>
        </div>

        {/* Action Buttons */}
        <div className='p-6 border-t border-neutral-200 dark:border-neutral-700'>
          <div className='flex space-x-3'>
            <button
              onClick={onClose}
              className='flex-1 py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium'
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className='flex-1 py-3 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white font-medium transition-colors'
            >
              {isLoading ? 'Processing...' : 'Confirm Swap'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
