import React from 'react'
import { RefreshToggle } from './RefreshToggle'
import { InlineLoader } from './Loader'
import { Tooltip } from './Tooltip'
import { RefreshRate } from '../utils/refresh'

interface ExchangeRateInfoProps {
  sourceToken: string
  targetToken: string
  exchangeRate: number
  refreshRate: RefreshRate
  onRefreshRateChange: (rate: RefreshRate) => void
  isLoading: boolean
  realSwapRate?: {
    success: boolean
    data?: {
      exchangeRate: number
    }
  }
  sourceTokenPrice?: {
    success: boolean
    data?: {
      priceUsd: number
    }
  }
  targetTokenPrice?: {
    success: boolean
    data?: {
      priceUsd: number
    }
  }
  gasPrice?: {
    success: boolean
    data?: {
      gasPriceGwei: number
      estimatedCosts: {
        tokenSwap: {
          costEth: number
        }
      }
    }
  }
  sourcePriceLoading: boolean
  targetPriceLoading: boolean
  gasPriceLoading: boolean
}

export const ExchangeRateInfo: React.FC<ExchangeRateInfoProps> = ({
  sourceToken,
  targetToken,
  exchangeRate,
  refreshRate,
  onRefreshRateChange,
  isLoading,
  realSwapRate,
  sourceTokenPrice,
  targetTokenPrice,
  gasPrice,
  sourcePriceLoading,
  targetPriceLoading,
  gasPriceLoading,
}) => {
  return (
    <div className='space-y-4 mb-4'>
      {/* Exchange Rate */}
      <div className='flex justify-between items-center text-sm text-text-light-muted dark:text-text-dark-muted mb-3'>
        <div className='flex items-center gap-2'>
          <span>Exchange Rate</span>
          <RefreshToggle
            refreshRate={refreshRate}
            onRefreshRateChange={onRefreshRateChange}
            isLoading={isLoading}
          />
        </div>
        <span>
          {isLoading ? (
            <InlineLoader />
          ) : realSwapRate?.success && realSwapRate.data ? (
            <>
              1 {sourceToken} ≈ {realSwapRate.data.exchangeRate.toFixed(6)} {targetToken}
              <span className='text-xs text-green-600 ml-2'>• Live</span>
            </>
          ) : (
            <>
              1 {sourceToken} ≈ {exchangeRate.toFixed(6)} {targetToken}
              <span className='text-xs text-yellow-600 ml-2'>• Estimated</span>
            </>
          )}
        </span>
      </div>

      {/* Real-time Pricing Information */}
      <div className='space-y-2'>
        {/* Token Prices */}
        <div className='flex justify-between text-xs text-text-light-muted dark:text-text-dark-muted'>
          <span>{sourceToken} Price</span>
          <span>
            {sourcePriceLoading ? (
              <InlineLoader />
            ) : sourceTokenPrice?.success && sourceTokenPrice.data ? (
              <>${sourceTokenPrice.data.priceUsd.toFixed(2)}</>
            ) : (
              'Price unavailable'
            )}
          </span>
        </div>
        <div className='flex justify-between text-xs text-text-light-muted dark:text-text-dark-muted'>
          <span>{targetToken} Price</span>
          <span>
            {targetPriceLoading ? (
              <InlineLoader />
            ) : targetTokenPrice?.success && targetTokenPrice.data ? (
              <>${targetTokenPrice.data.priceUsd.toFixed(2)}</>
            ) : (
              'Price unavailable'
            )}
          </span>
        </div>

        {/* Gas Estimation */}
        <div className='flex justify-between text-xs text-text-light-muted dark:text-text-dark-muted'>
          <span>Estimated Gas Fee</span>
          <span>
            {gasPriceLoading ? (
              <InlineLoader />
            ) : gasPrice?.success && gasPrice.data ? (
              <Tooltip
                content={`Gas Price: ${gasPrice.data.gasPriceGwei.toFixed(2)} Gwei | Limit: ~150,000`}
              >
                <span className='cursor-help border-b border-dotted'>
                  {(() => {
                    // Get ETH price dynamically instead of hardcoding 3500
                    const ethPrice =
                      sourceToken === 'ETH' && sourceTokenPrice?.data?.priceUsd
                        ? sourceTokenPrice.data.priceUsd
                        : targetToken === 'ETH' && targetTokenPrice?.data?.priceUsd
                          ? targetTokenPrice.data.priceUsd
                          : 3500 // Fallback price

                    return `~$${(gasPrice.data.estimatedCosts.tokenSwap.costEth * ethPrice).toFixed(2)} (${gasPrice.data.estimatedCosts.tokenSwap.costEth.toFixed(6)} ETH)`
                  })()}
                </span>
              </Tooltip>
            ) : (
              'Gas unavailable'
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
