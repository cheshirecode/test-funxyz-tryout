import React from 'react'
import { useSwapFeature } from '../features'

interface SwapSummaryProps {
  className?: string
}

// Fallback image URL for when token icons fail to load
// Used due to rate-limiting from cryptologos.cc - provides generic crypto icon as fallback
const FALLBACK_ICON_URL =
  'https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png'

export const SwapSummary: React.FC<SwapSummaryProps> = ({ className = '' }) => {
  const {
    sourceToken,
    targetToken,
    usdAmount,
    sourceTokenAmount,
    targetTokenAmount,
    exchangeRate,
    swapping,
    swapComplete,
    tokenData,
  } = useSwapFeature()

  const sourceTokenData = tokenData?.[sourceToken]
  const targetTokenData = tokenData?.[targetToken]

  // Handle image error with fallback
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.target as HTMLImageElement
    if (target.src !== FALLBACK_ICON_URL) {
      target.src = FALLBACK_ICON_URL
    }
  }

  return (
    <div
      className={`bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 ${className}`}
    >
      <h3 className='text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-3'>
        Swap Summary
      </h3>

      <div className='space-y-3'>
        {/* Source Token */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <img
              src={sourceTokenData?.icon || ''}
              alt={sourceToken}
              className='w-6 h-6 rounded-full'
              onError={handleImageError}
            />
            <span className='text-text-light-primary dark:text-text-dark-primary font-medium'>
              {sourceToken}
            </span>
          </div>
          <span className='text-text-light-secondary dark:text-text-dark-secondary'>
            {sourceTokenAmount}
          </span>
        </div>

        {/* Exchange Rate */}
        <div className='text-center text-sm text-text-light-secondary dark:text-text-dark-secondary'>
          1 {sourceToken} = {exchangeRate.toFixed(6)} {targetToken}
        </div>

        {/* Target Token */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <img
              src={targetTokenData?.icon || ''}
              alt={targetToken}
              className='w-6 h-6 rounded-full'
              onError={handleImageError}
            />
            <span className='text-text-light-primary dark:text-text-dark-primary font-medium'>
              {targetToken}
            </span>
          </div>
          <span className='text-text-light-secondary dark:text-text-dark-secondary'>
            {targetTokenAmount}
          </span>
        </div>

        {/* Status */}
        {swapping && (
          <div className='text-center text-sm text-blue-600 dark:text-blue-400'>Swapping...</div>
        )}
        {swapComplete && (
          <div className='text-center text-sm text-green-600 dark:text-green-400'>
            Swap Complete!
          </div>
        )}

        {/* USD Amount */}
        <div className='text-center pt-2 border-t border-neutral-200 dark:border-neutral-700'>
          <div className='text-lg font-bold text-text-light-primary dark:text-text-dark-primary'>
            ${usdAmount}
          </div>
          <div className='text-xs text-text-light-secondary dark:text-text-dark-secondary'>
            Total Value
          </div>
        </div>

        {/* Fallback Icon Notice */}
        <div className='text-xs text-text-light-secondary dark:text-text-dark-secondary text-center'>
          * Generic crypto icons may appear due to rate-limiting from cryptologos.cc
        </div>
      </div>
    </div>
  )
}
