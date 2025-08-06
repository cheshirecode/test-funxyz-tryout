import { useMemo } from 'react'
import type { TokenData } from '@types'

export interface GasPriceData {
  success: boolean
  data?: {
    gasPrice?: unknown
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

export interface UseGasCalculationProps {
  gasPrice?: GasPriceData
  tokenData: Record<string, TokenData>
  sourceToken: string
  targetToken: string
  usdAmount: string
}

export interface UseGasCalculationReturn {
  gasCostEth: number
  estimatedGasFeeUsd: number
  totalCostUsd: number
  ethPrice: number
}

/**
 * Hook for calculating gas costs and total transaction costs
 * Handles ETH price discovery and USD conversion
 */
export function useGasCalculation({
  gasPrice,
  tokenData,
  sourceToken,
  targetToken,
  usdAmount,
}: UseGasCalculationProps): UseGasCalculationReturn {
  const calculations = useMemo(() => {
    // Get gas cost in ETH from the gas price data
    const gasCostEth = gasPrice?.data?.estimatedCosts?.tokenSwap?.costEth || 0.00005 // Default ETH cost

    // Get ETH price to convert gas cost from ETH to USD
    const ethPrice =
      tokenData['ETH']?.usdPrice ||
      (sourceToken === 'ETH'
        ? tokenData[sourceToken]?.usdPrice
        : targetToken === 'ETH'
          ? tokenData[targetToken]?.usdPrice
          : 3500) // Default ETH price

    // Calculate gas fee in USD
    const estimatedGasFeeUsd = gasCostEth * ethPrice

    // Calculate total cost in USD (swap amount + gas fee)
    const totalCostUsd = parseFloat(usdAmount || '0') + estimatedGasFeeUsd

    return {
      gasCostEth,
      estimatedGasFeeUsd,
      totalCostUsd,
      ethPrice,
    }
  }, [gasPrice, tokenData, sourceToken, targetToken, usdAmount])

  return calculations
}
