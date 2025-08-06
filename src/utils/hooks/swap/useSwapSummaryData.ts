import { useMemo } from 'react'
import type { TokenData } from '@types'

export interface UseSwapSummaryDataProps {
  sourceToken: string
  targetToken: string
  usdAmount: string
  sourceTokenAmount: string
  targetTokenAmount: string
  exchangeRate: number
  swapping: boolean
  swapComplete: boolean
  tokenData: Record<string, TokenData>
}

export interface UseSwapSummaryDataReturn {
  sourceTokenData: TokenData | undefined
  targetTokenData: TokenData | undefined
  formattedSourceAmount: string
  formattedTargetAmount: string
  formattedUsdAmount: string
  formattedExchangeRate: string
  totalValueUsd: number
  isSwapInProgress: boolean
  hasValidData: boolean
}

/**
 * Hook for processing and formatting swap summary data
 * Handles all calculations and formatting for display
 */
export function useSwapSummaryData({
  sourceToken,
  targetToken,
  usdAmount,
  sourceTokenAmount,
  targetTokenAmount,
  exchangeRate,
  swapping,
  swapComplete: _swapComplete,
  tokenData,
}: UseSwapSummaryDataProps): UseSwapSummaryDataReturn {
  const summaryData = useMemo(() => {
    const sourceTokenData = tokenData?.[sourceToken]
    const targetTokenData = tokenData?.[targetToken]

    // Format amounts for display
    const formattedSourceAmount = parseFloat(sourceTokenAmount || '0').toFixed(
      sourceTokenData?.decimals || 6
    )
    const formattedTargetAmount = parseFloat(targetTokenAmount || '0').toFixed(
      targetTokenData?.decimals || 2
    )
    const formattedUsdAmount = parseFloat(usdAmount || '0').toFixed(2)

    // Format exchange rate
    const formattedExchangeRate = exchangeRate.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })

    // Calculate total value in USD
    const totalValueUsd = parseFloat(usdAmount || '0')

    // Status checks
    const isSwapInProgress = swapping
    const hasValidData = !!(
      sourceTokenData &&
      targetTokenData &&
      sourceTokenAmount &&
      targetTokenAmount &&
      usdAmount
    )

    return {
      sourceTokenData,
      targetTokenData,
      formattedSourceAmount,
      formattedTargetAmount,
      formattedUsdAmount,
      formattedExchangeRate,
      totalValueUsd,
      isSwapInProgress,
      hasValidData,
    }
  }, [
    sourceToken,
    targetToken,
    usdAmount,
    sourceTokenAmount,
    targetTokenAmount,
    exchangeRate,
    swapping,
    tokenData,
  ])

  return summaryData
}
