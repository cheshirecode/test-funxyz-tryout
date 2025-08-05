import { WalletIcon, PlayCircle, HelpCircle } from 'lucide-react'
import { Link } from 'wouter'
import { useState } from 'react'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Tooltip } from './Tooltip'
import { QuickSelect } from './QuickSelect'
import { AmountInput } from './AmountInput'
import { TokenSwapSection } from './TokenSwapSection'
import { SwapDirectionButton } from './SwapDirectionButton'
import { ExchangeRateInfo } from './ExchangeRateInfo'
import { SwapButton } from './SwapButton'
import { SwapConfirmationDialog } from './SwapConfirmationDialog'
import { TutorialOverlay } from './TutorialOverlay'
import { useSwapFeature } from '../features'
import type { RefreshRate } from '../utils/refresh/refreshUtils'

export const TokenSwap = () => {
  const [showTutorial, setShowTutorial] = useState(false)

  // Use the main swap feature hook that orchestrates all business logic
  const {
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

    // Swap execution
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
  } = useSwapFeature()

  return (
    <div className='w-full max-w-sm sm:max-w-md mx-auto p-3 sm:p-6 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700'>
      {/* Header - Token Price Explorer as per wireframe */}
      <div className='text-center mb-4 sm:mb-6'>
        <h1 className='text-xl sm:text-2xl font-bold font-header text-text-light-primary dark:text-text-dark-primary mb-2'>
          Token Price Explorer
        </h1>
        <div className='flex items-center justify-between'>
          <span className='text-xs sm:text-sm text-text-light-secondary dark:text-text-dark-secondary'>
            Swap Tokens
          </span>
          <div className='flex items-center gap-1 sm:gap-2'>
            <Tooltip content='incoming funkit wallet integration'>
              <button className='p-1.5 sm:p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 min-h-[36px] sm:min-h-[44px] min-w-[36px] sm:min-w-[44px] flex items-center justify-center opacity-50 cursor-not-allowed'>
                <WalletIcon
                  size={16}
                  className='sm:w-5 sm:h-5 text-neutral-400 dark:text-neutral-500'
                />
              </button>
            </Tooltip>
            <Tooltip content='View demo and API examples'>
              <Link href='/demo'>
                <button
                  data-tutorial='demo-button'
                  className='p-1.5 sm:p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 min-h-[36px] sm:min-h-[44px] min-w-[36px] sm:min-w-[44px] flex items-center justify-center transition-colors'
                >
                  <PlayCircle
                    size={16}
                    className='sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400'
                  />
                </button>
              </Link>
            </Tooltip>
            <Tooltip content='Interactive tutorial guide'>
              <button
                onClick={() => setShowTutorial(true)}
                className='p-1.5 sm:p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 min-h-[36px] sm:min-h-[44px] min-w-[36px] sm:min-w-[44px] flex items-center justify-center transition-colors'
              >
                <HelpCircle
                  size={16}
                  className='sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400'
                />
              </button>
            </Tooltip>
            <ThemeSwitcher data-tutorial='theme-switcher' />
          </div>
        </div>
      </div>

      {/* Quick Select Token Buttons */}
      <div data-tutorial='quick-select'>
        <QuickSelect
          availableTokens={availableTokens}
          getTokenSelectionState={getTokenSelectionState}
          handleQuickSelect={handleQuickSelect}
          tokenData={tokenData || {}}
        />
      </div>

      {/* USD Amount Section */}
      <div data-tutorial='amount-input'>
        <AmountInput usdAmount={usdAmount} setUsdAmount={setUsdAmount} />
      </div>

      {/* Source Token Section - FROM */}
      <div className='mb-2' data-tutorial='source-token'>
        <TokenSwapSection
          type='source'
          selectedToken={sourceToken}
          onSelectToken={setSourceToken}
          disabledToken={targetToken}
          tokenData={tokenData || {}}
          tokenAmount={sourceTokenAmount}
          isLoading={tokensLoading}
          canExecuteSwap={canExecuteSwap}
        />
      </div>

      {/* Swap Direction Button */}
      <div data-tutorial='swap-direction'>
        <SwapDirectionButton onClick={swapTokenPositions} />
      </div>

      {/* Target Token Section - TO */}
      <div className='mt-2 mb-4 sm:mb-6' data-tutorial='target-token'>
        <TokenSwapSection
          type='target'
          selectedToken={targetToken}
          onSelectToken={setTargetToken}
          disabledToken={sourceToken}
          tokenData={tokenData || {}}
          tokenAmount={targetTokenAmount}
          isLoading={tokensLoading}
        />
      </div>

      {/* Exchange Rate and Pricing Information */}
      <div data-tutorial='exchange-rate'>
        <ExchangeRateInfo
          sourceToken={sourceToken}
          targetToken={targetToken}
          exchangeRate={exchangeRate}
          refreshRate={refreshRate as RefreshRate}
          onRefreshRateChange={(rate) => setRefreshRate(rate as any)}
          isLoading={tokensLoading || swapRateLoading}
          realSwapRate={realSwapRate}
          sourceTokenPrice={sourceTokenPrice}
          targetTokenPrice={targetTokenPrice}
          gasPrice={gasPrice}
          sourcePriceLoading={sourcePriceLoading}
          targetPriceLoading={targetPriceLoading}
          gasPriceLoading={gasPriceLoading}
        />
      </div>

      {/* Swap Button */}
      <div data-tutorial='swap-button'>
        <SwapButton
          onClick={handleSwapClick}
          disabled={buttonState.disabled}
          isSwapping={swapping}
          swapComplete={swapComplete}
          buttonText={buttonState.text}
          className={buttonState.className}
        />
      </div>

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
        tokenData={tokenData || {}}
        exchangeRate={exchangeRate}
        gasPrice={gasPrice}
        isLoading={swapping}
      />

      {/* Tutorial Overlay */}
      <TutorialOverlay isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  )
}
