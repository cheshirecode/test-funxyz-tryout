import React from 'react'
import { ArrowDownIcon, WalletIcon, HelpCircle } from 'lucide-react'
import { Link } from 'wouter'
import { TokenSelector } from './TokenSelector'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Tooltip } from './Tooltip'
import { ContractInfo } from './ContractInfo'
import {
  useTokenData,
  useSwapState,
  useSwapExecution,
  useTokenSelection,
} from '@hooks'
import {
  getSwapButtonState,
  getBalanceTextStyle,
  handleTokenIconError,
  formatTokenBalance,
} from '@helpers'

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
    setSwapState,
    setTokenData,
    swapTokenPositions,
  } = useSwapState()

  // Connect React Query token data to Jotai atom
  React.useEffect(() => {
    if (tokenData) {
      setTokenData(tokenData)
    }
  }, [tokenData, setTokenData])

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
        <h1 className='text-2xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2'>
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
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-lg font-semibold text-text-light-primary dark:text-text-dark-primary'>
            Quick Select
          </h3>
          <div className='flex items-center space-x-2 text-xs text-text-light-muted dark:text-text-dark-muted'>
            <span className='flex items-center'>
              <div className='w-2 h-2 bg-primary-500 rounded-full mr-1'></div>
              Source
            </span>
            <span className='flex items-center'>
              <div className='w-2 h-2 bg-success-500 rounded-full mr-1'></div>
              Target
            </span>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <div className='flex gap-2 pb-2' style={{ minWidth: 'max-content' }}>
            {availableTokens.map((token) => {
              const { isSource, isTarget, isSelected } = getTokenSelectionState(token)

              return (
                <button
                  key={token}
                  onClick={() => handleQuickSelect(token)}
                  className={`relative p-3 rounded-xl min-h-[44px] min-w-[80px] font-medium text-sm transition-colors flex flex-col items-center justify-center flex-shrink-0
                    ${
                      isSelected
                        ? 'bg-surface-light dark:bg-surface-dark border-2 border-primary-200 dark:border-primary-700 shadow-md'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-text-light-secondary dark:text-text-dark-secondary hover:bg-neutral-200 dark:hover:bg-neutral-600'
                    }`}
                >
                  {/* Token Icon */}
                  <img
                    src={tokenData[token]?.icon || ''}
                    alt={token}
                    className='w-6 h-6 rounded-full mb-1'
                    onError={(e) => handleTokenIconError(e, token, 24)}
                  />

                  {/* Token Symbol */}
                  <span
                    className={
                      isSelected
                        ? 'text-text-light-primary dark:text-text-dark-primary'
                        : 'text-text-light-secondary dark:text-text-dark-secondary'
                    }
                  >
                    {token}
                  </span>

                  {/* Source/Target Indicator */}
                  {isSource && (
                    <div className='absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold'>
                      S
                    </div>
                  )}
                  {isTarget && (
                    <div className='absolute -top-1 -right-1 w-5 h-5 bg-success-500 text-white text-xs rounded-full flex items-center justify-center font-bold'>
                      T
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className='text-center text-xs text-text-light-muted dark:text-text-dark-muted mt-2'>
          Click to select source token • Right-click to select target token • Click again to swap source/target
        </div>
      </div>

      {/* USD Amount Section - Prominent placement */}
      <div className='p-6 bg-surface-light dark:bg-surface-dark rounded-xl mb-6 border border-neutral-200 dark:border-neutral-700 shadow-sm'>
        <div className='text-center mb-4'>
          <h3 className='text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-2'>
            Enter Amount
          </h3>
          <div className='text-sm text-text-light-muted dark:text-text-dark-muted'>
            Specify the USD value to swap
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <span className='text-2xl font-medium text-text-light-muted dark:text-text-dark-muted mr-3'>
            $
          </span>
          <input
            type='number'
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            className='bg-transparent text-4xl font-bold text-center outline-none text-text-light-primary dark:text-text-dark-primary placeholder-text-light-muted dark:placeholder-text-dark-muted min-w-0 flex-1 max-w-xs focus:ring-2 focus:ring-primary-500/30 dark:focus:ring-primary-400/30 rounded-lg px-2 py-1 transition-all duration-200'
            placeholder='0.00'
            step='0.01'
          />
        </div>
      </div>

      {/* Source Token Section - FROM */}
      <div className='p-4 bg-surface-light-secondary dark:bg-surface-dark-secondary rounded-xl mb-2 border border-neutral-200 dark:border-neutral-700'>
        <div className='flex justify-between mb-2'>
          <div className='flex items-center'>
            <div className='w-2 h-2 bg-primary-500 rounded-full mr-2'></div>
            <span className='text-sm font-medium text-primary-600 dark:text-primary-400'>From</span>
          </div>
          <span
            className={`text-sm ${getBalanceTextStyle(sourceTokenAmount, sourceToken, tokenData)}`}
          >
            Balance:{' '}
            {formatTokenBalance(tokenData[sourceToken]?.balance || 0, sourceToken, tokensLoading)}
          </span>
        </div>

        {/* Source Token Amount Display */}
        <div className='flex items-center'>
          <div className='w-full bg-transparent text-token-amount outline-none text-text-light-primary dark:text-text-dark-primary'>
            {sourceTokenAmount}
          </div>
          <TokenSelector
            selectedToken={sourceToken}
            onSelectToken={setSourceToken}
            disabledToken={targetToken}
            tokenData={tokenData}
            isLoading={tokensLoading}
          />
        </div>

        {/* Contract Information */}
        <div className='mt-2 flex justify-between items-center'>
          <ContractInfo
            contractAddress={tokenData[sourceToken]?.contractAddress}
            chainId={tokenData[sourceToken]?.chainId}
            symbol={sourceToken}
          />
        </div>

        {!canExecuteSwap &&
          getBalanceTextStyle(sourceTokenAmount, sourceToken, tokenData) === 'text-error-500' && (
            <div className='mt-2 text-error-500 text-sm'>Insufficient {sourceToken} balance</div>
          )}
      </div>

      {/* Swap Direction Button - Large, interactive as per design principles */}
      <div className='flex justify-center -my-3 relative z-10'>
        <button
          onClick={swapTokenPositions}
          className='p-3 rounded-full bg-surface-light dark:bg-surface-dark border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors'
        >
          <ArrowDownIcon
            size={20}
            className='text-text-light-secondary dark:text-text-dark-secondary'
          />
        </button>
      </div>

      {/* Target Token Section - TO */}
      <div className='p-4 bg-surface-light-secondary dark:bg-surface-dark-secondary rounded-xl mt-2 mb-6 border border-neutral-200 dark:border-neutral-700'>
        <div className='flex justify-between mb-2'>
          <div className='flex items-center'>
            <div className='w-2 h-2 bg-success-500 rounded-full mr-2'></div>
            <span className='text-sm font-medium text-success-600 dark:text-success-400'>To</span>
          </div>
          <span className='text-sm text-text-light-muted dark:text-text-dark-muted'>
            Balance:{' '}
            {formatTokenBalance(tokenData[targetToken]?.balance || 0, targetToken, tokensLoading)}
          </span>
        </div>
        <div className='flex items-center'>
          <div className='w-full bg-transparent text-token-amount outline-none text-text-light-primary dark:text-text-dark-primary'>
            {targetTokenAmount}
          </div>
          <TokenSelector
            selectedToken={targetToken}
            onSelectToken={setTargetToken}
            disabledToken={sourceToken}
            tokenData={tokenData}
            isLoading={tokensLoading}
          />
        </div>

        {/* Contract Information */}
        <div className='mt-2 flex justify-between items-center'>
          <ContractInfo
            contractAddress={tokenData[targetToken]?.contractAddress}
            chainId={tokenData[targetToken]?.chainId}
            symbol={targetToken}
          />
          {/* <div className='text-sm text-text-light-muted dark:text-text-dark-muted'>
            ≈ ${usdAmount}
          </div> */}
        </div>
      </div>

      {/* Exchange Rate */}
      <div className='flex justify-between text-sm text-text-light-muted dark:text-text-dark-muted mb-6'>
        <span>Exchange Rate</span>
        <span>
          {tokensLoading ? (
            'Loading...'
          ) : (
            <>
              1 {sourceToken} ≈ {exchangeRate.toFixed(6)} {targetToken}
            </>
          )}
        </span>
      </div>

      {/* Swap Button - Prominent, elevated design with proper states */}
      <button
        onClick={executeSwap}
        disabled={buttonState.disabled}
        className={`w-full py-4 px-4 rounded-xl font-medium flex justify-center items-center min-h-[44px] transition-colors ${buttonState.className}`}
      >
        {swapping ? (
          <div className='flex items-center'>
            <svg
              className='animate-spin -ml-1 mr-2 h-5 w-5 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            Swapping...
          </div>
        ) : swapComplete ? (
          <div className='flex items-center'>
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 13l4 4L19 7'
              ></path>
            </svg>
            Swap Successful
          </div>
        ) : (
          buttonState.text
        )}
      </button>
    </div>
  )
}
