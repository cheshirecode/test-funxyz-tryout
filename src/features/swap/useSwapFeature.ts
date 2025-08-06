import React from 'react'
import { useTokenData } from '@utils/hooks/data/useTokenData'
import { useSwapState } from '@utils/hooks/swap/useSwapState'
import { useRefreshControl } from '@utils/hooks/refresh/useRefreshControl'
import { useTokenPrice, useGasPrice, useSwapRate } from '@utils/hooks/pricing/usePricing'
import { useSwapExecution } from '@utils/hooks/swap/useSwapExecution'
import { useTokenSelection } from '@utils/hooks/swap/useTokenSelection'
import { useChain } from '@utils/hooks/chain'
import { getSwapButtonState } from '@utils/helpers/buttonStateUtils'
import type { RefreshRate } from '@utils/refresh/refreshUtils'

export interface UseSwapFeatureReturn {
  // Token data
  tokenData: Record<string, any> | null
  tokensLoading: boolean

  // Swap state
  sourceToken: string
  setSourceToken: (token: string) => void
  targetToken: string
  setTargetToken: (token: string) => void
  usdAmount: string
  setUsdAmount: (amount: string) => void
  sourceTokenAmount: string
  targetTokenAmount: string
  exchangeRate: number
  swapping: boolean
  swapComplete: boolean
  showConfirmation: boolean

  // Pricing data
  sourceTokenPrice: any
  targetTokenPrice: any
  gasPrice: any
  realSwapRate: any
  sourcePriceLoading: boolean
  targetPriceLoading: boolean
  gasPriceLoading: boolean
  swapRateLoading: boolean

  // Refresh control
  refreshRate: RefreshRate
  setRefreshRate: (rate: RefreshRate) => void
  refreshInterval: number | false
  staleTime: number
  queryKeySuffix: string

  // Swap execution
  executeSwap: () => void
  canExecuteSwap: boolean

  // Token selection
  availableTokens: string[]
  handleQuickSelect: (token: string) => void
  getTokenSelectionState: (token: string) => {
    isSource: boolean
    isTarget: boolean
    isSelected: boolean
  }

  // Swap actions
  swapTokenPositions: () => void

  // Confirmation dialog
  handleSwapClick: () => void
  handleConfirmationCancel: () => void
  handleConfirmationConfirm: () => void

  // Button state
  buttonState: ReturnType<typeof getSwapButtonState>

  // Chain management
  currentChainId: string
  setCurrentChainId: (chainId: string) => void
}

/**
 * Main feature hook that orchestrates all swap-related business logic
 * Combines token data, pricing, state management, execution, and selection
 * Now uses dynamic chain ID instead of hardcoded '1'
 */
export function useSwapFeature(): UseSwapFeatureReturn {
  // Chain management
  const { currentChainId, setCurrentChainId } = useChain()

  // Token data management
  const { tokenData, isLoading: tokensLoading } = useTokenData()

  // Swap state management
  const {
    sourceToken,
    setSourceToken,
    targetToken,
    setTargetToken,
    usdAmount,
    setUsdAmount,
    sourceTokenAmount,
    targetTokenAmount,
    exchangeRate,
    swapping,
    swapComplete,
    showConfirmation,
    setSwapState,
    setTokenData,
    swapTokenPositions,
  } = useSwapState()

  // Refresh rate management
  const { refreshRate, setRefreshRate, refreshInterval, staleTime, queryKeySuffix } =
    useRefreshControl('disabled')

  // Real-time pricing and gas estimation using dynamic chain ID
  const { data: sourceTokenPrice, isLoading: sourcePriceLoading } = useTokenPrice(
    currentChainId,
    sourceToken,
    true,
    refreshInterval,
    staleTime,
    queryKeySuffix
  )
  const { data: targetTokenPrice, isLoading: targetPriceLoading } = useTokenPrice(
    currentChainId,
    targetToken,
    true,
    refreshInterval,
    staleTime,
    queryKeySuffix
  )
  const { data: gasPrice, isLoading: gasPriceLoading } = useGasPrice(
    currentChainId,
    true,
    refreshInterval,
    staleTime,
    queryKeySuffix
  )

  // Integrate token metadata and real-time pricing data into token data atom
  React.useEffect(() => {
    const baseTokenData = tokenData || {}
    const updatedTokenData = { ...baseTokenData }

    // Add source token pricing data
    if (sourceTokenPrice?.data) {
      updatedTokenData[sourceToken] = {
        ...baseTokenData[sourceToken],
        symbol: sourceToken,
        usdPrice: sourceTokenPrice.data.priceUsd,
        decimals: sourceTokenPrice.data.decimals || 18,
        name: sourceTokenPrice.data.name || sourceToken,
        icon: baseTokenData[sourceToken]?.icon || '',
        balance: baseTokenData[sourceToken]?.balance || 0,
        chainId: currentChainId, // Use current chain ID
      }
    }

    // Add target token pricing data
    if (targetTokenPrice?.data) {
      updatedTokenData[targetToken] = {
        ...baseTokenData[targetToken],
        symbol: targetToken,
        usdPrice: targetTokenPrice.data.priceUsd,
        decimals: targetTokenPrice.data.decimals || 18,
        name: targetTokenPrice.data.name || targetToken,
        icon: baseTokenData[targetToken]?.icon || '',
        balance: baseTokenData[targetToken]?.balance || 0,
        chainId: currentChainId, // Use current chain ID
      }
    }

    // Only update if we have pricing data for at least one token
    if (sourceTokenPrice?.data || targetTokenPrice?.data) {
      setTokenData(updatedTokenData)
    }
  }, [
    sourceTokenPrice,
    targetTokenPrice,
    sourceToken,
    targetToken,
    tokenData,
    setTokenData,
    currentChainId,
  ])

  // Real-time swap rate using dynamic chain ID
  const { data: realSwapRate, isLoading: swapRateLoading } = useSwapRate(
    currentChainId,
    sourceToken,
    currentChainId,
    targetToken,
    usdAmount || '100',
    true,
    refreshInterval,
    staleTime,
    queryKeySuffix
  )

  // Swap execution logic
  const { executeSwap, canExecuteSwap } = useSwapExecution({
    usdAmount,
    sourceTokenAmount,
    sourceToken,
    tokenData,
    swapping,
    setSwapState,
  })

  // Token selection logic
  const { availableTokens, handleQuickSelect, getTokenSelectionState } = useTokenSelection({
    sourceToken,
    targetToken,
    setSourceToken,
    setTargetToken,
  })

  // Confirmation dialog handlers
  const handleSwapClick = () => {
    if (!canExecuteSwap) return
    setSwapState({ showConfirmation: true })
  }

  const handleConfirmationCancel = () => {
    setSwapState({ showConfirmation: false })
  }

  const handleConfirmationConfirm = () => {
    setSwapState({ showConfirmation: false })
    executeSwap()
  }

  // Get button state for UI
  const buttonState = getSwapButtonState(
    usdAmount,
    sourceTokenAmount,
    sourceToken,
    targetToken,
    tokenData,
    swapping,
    swapComplete
  )

  return {
    // Token data
    tokenData,
    tokensLoading,

    // Swap state
    sourceToken,
    setSourceToken,
    targetToken,
    setTargetToken,
    usdAmount,
    setUsdAmount,
    sourceTokenAmount,
    targetTokenAmount,
    exchangeRate,
    swapping,
    swapComplete,
    showConfirmation,

    // Pricing data
    sourceTokenPrice,
    targetTokenPrice,
    gasPrice,
    realSwapRate,
    sourcePriceLoading,
    targetPriceLoading,
    gasPriceLoading,
    swapRateLoading,

    // Refresh control
    refreshRate,
    setRefreshRate,
    refreshInterval,
    staleTime,
    queryKeySuffix,

    // Swap execution
    executeSwap,
    canExecuteSwap,

    // Token selection
    availableTokens,
    handleQuickSelect,
    getTokenSelectionState,

    // Swap actions
    swapTokenPositions,

    // Confirmation dialog
    handleSwapClick,
    handleConfirmationCancel,
    handleConfirmationConfirm,

    // Button state
    buttonState,

    // Chain management
    currentChainId,
    setCurrentChainId,
  }
}
