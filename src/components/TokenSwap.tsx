import { ArrowDownIcon, WalletIcon } from 'lucide-react'
import { TokenSelector } from './TokenSelector'
import {
  useTokenData,
  useSwapState,
  useSwapCalculations,
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
    swapping,
    swapComplete,
    setSwapState,
    swapTokenPositions,
  } = useSwapState()

  const { sourceTokenAmount, targetTokenAmount, exchangeRate } = useSwapCalculations({
    usdAmount,
    sourceToken,
    targetToken,
    tokenData,
  })

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
    <div className='w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg'>
      {/* Header - Token Price Explorer as per wireframe */}
      <div className='text-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Token Price Explorer</h1>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-600'>Swap Tokens</span>
          <button className='p-2 rounded-full bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center opacity-50 cursor-not-allowed'>
            <WalletIcon size={20} className='text-gray-400' />
          </button>
        </div>
      </div>

      {/* Quick Select Token Buttons */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-lg font-semibold text-gray-800'>Quick Select</h3>
          <div className='flex items-center space-x-2 text-xs text-gray-500'>
            <span className='flex items-center'>
              <div className='w-2 h-2 bg-blue-500 rounded-full mr-1'></div>
              Source
            </span>
            <span className='flex items-center'>
              <div className='w-2 h-2 bg-green-500 rounded-full mr-1'></div>
              Target
            </span>
          </div>
        </div>

        <div className='grid grid-cols-4 gap-2'>
          {availableTokens.map((token) => {
            const { isSource, isTarget, isSelected } = getTokenSelectionState(token)

            return (
              <button
                key={token}
                onClick={() => handleQuickSelect(token)}
                className={`relative p-3 rounded-xl min-h-[44px] font-medium text-sm transition-colors flex flex-col items-center justify-center
                  ${
                    isSelected
                      ? 'bg-white border-2 shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <span className={isSelected ? 'text-gray-800' : 'text-gray-600'}>{token}</span>

                {/* Source/Target Indicator */}
                {isSource && (
                  <div className='absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold'>
                    S
                  </div>
                )}
                {isTarget && (
                  <div className='absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold'>
                    T
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className='text-center text-xs text-gray-500 mt-2'>
          Click to select source token • Right-click to select target token
        </div>
      </div>

      {/* Source Token Section - FROM */}
      <div className='p-4 bg-gray-50 rounded-xl mb-2'>
        <div className='flex justify-between mb-2'>
          <div className='flex items-center'>
            <div className='w-2 h-2 bg-blue-500 rounded-full mr-2'></div>
            <span className='text-sm font-medium text-blue-600'>From</span>
          </div>
          <span
            className={`text-sm ${getBalanceTextStyle(sourceTokenAmount, sourceToken, tokenData)}`}
          >
            Balance:{' '}
            {formatTokenBalance(tokenData[sourceToken]?.balance || 0, sourceToken, tokensLoading)}
          </span>
        </div>

        {/* USD Input Field */}
        <div className='mb-3'>
          <div className='flex items-center'>
            <span className='text-sm text-gray-500 mr-2'>USD Amount</span>
            <input
              type='number'
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              className='w-full bg-transparent text-token-amount outline-none text-gray-900'
              placeholder='0.00'
              step='0.01'
            />
          </div>
        </div>

        {/* Source Token Amount Display */}
        <div className='flex items-center'>
          <div className='w-full bg-transparent text-token-amount outline-none text-gray-900'>
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

        {!canExecuteSwap &&
          getBalanceTextStyle(sourceTokenAmount, sourceToken, tokenData) === 'text-error-500' && (
            <div className='mt-2 text-error-500 text-sm'>Insufficient {sourceToken} balance</div>
          )}
      </div>

      {/* Swap Direction Button - Large, interactive as per design principles */}
      <div className='flex justify-center -my-3 relative z-10'>
        <button
          onClick={swapTokenPositions}
          className='p-3 rounded-full bg-white border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors'
        >
          <ArrowDownIcon size={20} className='text-gray-600' />
        </button>
      </div>

      {/* Target Token Section - TO */}
      <div className='p-4 bg-gray-50 rounded-xl mt-2 mb-6'>
        <div className='flex justify-between mb-2'>
          <div className='flex items-center'>
            <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
            <span className='text-sm font-medium text-green-600'>To</span>
          </div>
          <span className='text-sm text-gray-500'>
            Balance:{' '}
            {formatTokenBalance(tokenData[targetToken]?.balance || 0, targetToken, tokensLoading)}
          </span>
        </div>
        <div className='flex items-center'>
          <div className='w-full bg-transparent text-token-amount outline-none text-gray-900'>
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
        <div className='mt-1 text-right text-sm text-gray-500'>≈ ${usdAmount}</div>
      </div>

      {/* Exchange Rate */}
      <div className='flex justify-between text-sm text-gray-500 mb-6'>
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
