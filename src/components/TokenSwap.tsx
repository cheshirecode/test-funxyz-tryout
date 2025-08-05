import React from 'react'
import { WalletIcon, HelpCircle } from 'lucide-react'
import { Link } from 'wouter'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Tooltip } from './Tooltip'
import { QuickSelect } from './QuickSelect'
import { AmountInput } from './AmountInput'
import { TokenSwapSection } from './TokenSwapSection'
import { SwapDirectionButton } from './SwapDirectionButton'
import { ExchangeRateInfo } from './ExchangeRateInfo'
import { SwapButton } from './SwapButton'
import { SwapConfirmationDialog } from './SwapConfirmationDialog'
import { useRefreshRate } from './RefreshToggle'
import {
  useTokenData,
  useSwapState,
  useSwapExecution,
  useTokenSelection,
  useTokenPrice,
  useGasPrice,
  useSwapRate,
} from '@hooks'
import { getSwapButtonState } from '@helpers'

export const TokenSwap = () => {
  // Custom hooks for all business logic
  const { tokenData, isLoading: tokensLoading } = useTokenData()
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

  // Refresh rate management with refactored hooks
  const { refreshRate, setRefreshRate, refreshInterval, staleTime, queryKeySuffix } =
    useRefreshRate('disabled')

  // Real-time pricing and gas estimation with proper query deduplication
  const { data: sourceTokenPrice, isLoading: sourcePriceLoading } = useTokenPrice(
    '1',
    sourceToken,
    true,
    refreshInterval,
    staleTime,
    queryKeySuffix
  )
  const { data: targetTokenPrice, isLoading: targetPriceLoading } = useTokenPrice(
    '1',
    targetToken,
    true,
    refreshInterval,
    staleTime,
    queryKeySuffix
  )
  const { data: gasPrice, isLoading: gasPriceLoading } = useGasPrice(
    '1',
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
      }
    }

    // Only update if we have pricing data for at least one token
    if (sourceTokenPrice?.data || targetTokenPrice?.data) {
      setTokenData(updatedTokenData)
    }
  }, [sourceTokenPrice, targetTokenPrice, sourceToken, targetToken, tokenData, setTokenData])
  const { data: realSwapRate, isLoading: swapRateLoading } = useSwapRate(
    '1',
    sourceToken,
    '1',
    targetToken,
    usdAmount || '100',
    true,
    refreshInterval,
    staleTime,
    queryKeySuffix
  )

  const { executeSwap, canExecuteSwap } = useSwapExecution({
    usdAmount,
    sourceTokenAmount,
    sourceToken,
    tokenData,
    swapping,
    setSwapState,
  })

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

  return (
    <div className='w-full max-w-md mx-auto p-6 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700'>
      {/* Header - Token Price Explorer as per wireframe */}
      <div className='text-center mb-6'>
        <h1 className='text-2xl font-bold font-header text-text-light-primary dark:text-text-dark-primary mb-2'>
          Token Price Explorer
        </h1>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
            Swap Tokens
          </span>
          <div className='flex items-center gap-2'>
            <Tooltip content='incoming funkit wallet integration'>
              <button className='p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 min-h-[44px] min-w-[44px] flex items-center justify-center opacity-50 cursor-not-allowed'>
                <WalletIcon size={20} className='text-neutral-400 dark:text-neutral-500' />
              </button>
            </Tooltip>
            <Tooltip content='View demo and API examples'>
              <Link href='/demo'>
                <button className='p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors'>
                  <HelpCircle size={20} className='text-neutral-600 dark:text-neutral-400' />
                </button>
              </Link>
            </Tooltip>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Quick Select Token Buttons */}
      <QuickSelect
        availableTokens={availableTokens}
        getTokenSelectionState={getTokenSelectionState}
        handleQuickSelect={handleQuickSelect}
        tokenData={tokenData}
      />

      {/* USD Amount Section */}
      <AmountInput usdAmount={usdAmount} setUsdAmount={setUsdAmount} />

      {/* Source Token Section - FROM */}
      <div className='mb-2'>
        <TokenSwapSection
          type='source'
          selectedToken={sourceToken}
          onSelectToken={setSourceToken}
          disabledToken={targetToken}
          tokenData={tokenData}
          tokenAmount={sourceTokenAmount}
          isLoading={tokensLoading}
          canExecuteSwap={canExecuteSwap}
        />
      </div>

      {/* Swap Direction Button */}
      <SwapDirectionButton onClick={swapTokenPositions} />

      {/* Target Token Section - TO */}
      <div className='mt-2 mb-6'>
        <TokenSwapSection
          type='target'
          selectedToken={targetToken}
          onSelectToken={setTargetToken}
          disabledToken={sourceToken}
          tokenData={tokenData}
          tokenAmount={targetTokenAmount}
          isLoading={tokensLoading}
        />
      </div>

      {/* Exchange Rate and Pricing Information */}
      <ExchangeRateInfo
        sourceToken={sourceToken}
        targetToken={targetToken}
        exchangeRate={exchangeRate}
        refreshRate={refreshRate}
        onRefreshRateChange={setRefreshRate}
        isLoading={tokensLoading || swapRateLoading}
        realSwapRate={realSwapRate}
        sourceTokenPrice={sourceTokenPrice}
        targetTokenPrice={targetTokenPrice}
        gasPrice={gasPrice}
        sourcePriceLoading={sourcePriceLoading}
        targetPriceLoading={targetPriceLoading}
        gasPriceLoading={gasPriceLoading}
      />

      {/* Swap Button */}
      <SwapButton
        onClick={handleSwapClick}
        disabled={buttonState.disabled}
        isSwapping={swapping}
        swapComplete={swapComplete}
        buttonText={buttonState.text}
        className={buttonState.className}
      />

      {/* Swap Confirmation Dialog */}
      <SwapConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleConfirmationCancel}
        onConfirm={handleConfirmationConfirm}
        usdAmount={usdAmount}
        sourceToken={sourceToken}
        targetToken={targetToken}
        sourceTokenAmount={sourceTokenAmount}
        targetTokenAmount={targetTokenAmount}
        tokenData={tokenData}
        exchangeRate={exchangeRate}
        gasPrice={gasPrice}
        isLoading={swapping}
      />
    </div>
  )
}
