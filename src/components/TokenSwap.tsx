import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownIcon, WalletIcon } from 'lucide-react'
import { TokenSelector } from './TokenSelector'
import { tokenService, defaultTokenData } from '../utils/tokenData'

export const TokenSwap = () => {
  const [sourceToken, setSourceToken] = useState('USDC')
  const [targetToken, setTargetToken] = useState('ETH')
  const [usdAmount, setUsdAmount] = useState<string>('100')
  const [sourceTokenAmount, setSourceTokenAmount] = useState<string>('0')
  const [targetTokenAmount, setTargetTokenAmount] = useState<string>('0')
  const [swapping, setSwapping] = useState(false)
  const [swapComplete, setSwapComplete] = useState(false)

  // Fetch token data from Funkit API using React Query
  const { data: tokenData, isLoading: tokensLoading } = useQuery({
    queryKey: ['tokens'],
    queryFn: () => tokenService.getTokens(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds,
    initialData: defaultTokenData
  })

  // Ensure tokenData is always available
  const safeTokenData = tokenData || defaultTokenData

  // Available tokens for the top selector buttons (as per wireframe)
  const availableTokens = ['USDC', 'USDT', 'ETH', 'WBTC']

  // Calculate token amounts from USD input
  useEffect(() => {
    if (!usdAmount || isNaN(parseFloat(usdAmount))) {
      setSourceTokenAmount('0')
      setTargetTokenAmount('0')
      return
    }
    const usd = parseFloat(usdAmount)

    // Calculate source token amount
    const sourceAmount = usd / (safeTokenData[sourceToken]?.usdPrice || 1)
    setSourceTokenAmount(sourceAmount.toFixed(safeTokenData[sourceToken]?.decimals || 2))

    // Calculate target token amount
    const targetAmount = usd / (safeTokenData[targetToken]?.usdPrice || 1)
    setTargetTokenAmount(targetAmount.toFixed(safeTokenData[targetToken]?.decimals || 2))
  }, [sourceToken, targetToken, usdAmount, safeTokenData])

  // Handle USD amount change
  const handleUsdAmountChange = (value: string) => {
    setUsdAmount(value)
  }

  // Check for insufficient balance
  const hasInsufficientBalance = () => {
    if (!sourceTokenAmount || isNaN(parseFloat(sourceTokenAmount))) return false
    return parseFloat(sourceTokenAmount) > (safeTokenData[sourceToken]?.balance || 0)
  }

  // Swap source and target tokens
  const handleSwapPositions = () => {
    setSourceToken(targetToken)
    setTargetToken(sourceToken)
  }

  // Execute the swap
  const executeSwap = () => {
    if (!usdAmount || isNaN(parseFloat(usdAmount)) || parseFloat(usdAmount) <= 0 || hasInsufficientBalance()) return
    setSwapping(true)
    // Simulate API call with timeout
    setTimeout(() => {
      setSwapping(false)
      setSwapComplete(true)
      // Reset swap complete status after 3 seconds
      setTimeout(() => {
        setSwapComplete(false)
      }, 3000)
    }, 1500)
  }

  // Get button state colors based on current state
  const getButtonState = () => {
    if (swapping) return 'bg-primary-500 text-white cursor-not-allowed'
    if (swapComplete) return 'bg-success-500 text-white'
    if (!usdAmount || parseFloat(usdAmount) <= 0) return 'bg-gray-300 text-gray-500 cursor-not-allowed'
    if (hasInsufficientBalance()) return 'bg-error-500 text-white cursor-not-allowed'
    return 'bg-primary-600 hover:bg-primary-700 text-white'
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header - Token Price Explorer as per wireframe */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Token Price Explorer</h1>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Swap Tokens</span>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <WalletIcon size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Token Selector Buttons - Horizontal row at top as per wireframe */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {availableTokens.map((token) => (
          <button
            key={token}
            onClick={() => {
              if (sourceToken === token) {
                setSourceToken(targetToken)
                setTargetToken(token)
              } else if (targetToken === token) {
                setTargetToken(sourceToken)
                setSourceToken(token)
              } else {
                setSourceToken(token)
              }
            }}
            className={`p-3 rounded-xl min-h-[44px] font-medium text-sm transition-colors
              ${sourceToken === token || targetToken === token
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {token}
          </button>
        ))}
      </div>

      {/* Source Token Section - FROM */}
      <div className="p-4 bg-gray-50 rounded-xl mb-2">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">From</span>
          <span className={`text-sm ${hasInsufficientBalance() ? 'text-error-500' : 'text-gray-500'}`}>
            Balance: {tokensLoading ? 'Loading...' : `${safeTokenData[sourceToken]?.balance || 0} ${sourceToken}`}
          </span>
        </div>

        {/* USD Input Field */}
        <div className="mb-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">USD Amount</span>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => handleUsdAmountChange(e.target.value)}
              className="w-full bg-transparent text-token-amount outline-none text-gray-900"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        {/* Source Token Amount Display */}
        <div className="flex items-center">
          <div className="w-full bg-transparent text-token-amount outline-none text-gray-900">
            {sourceTokenAmount}
          </div>
          <TokenSelector
            selectedToken={sourceToken}
            onSelectToken={setSourceToken}
            disabledToken={targetToken}
            tokenData={safeTokenData}
            isLoading={tokensLoading}
          />
        </div>

        {hasInsufficientBalance() && (
          <div className="mt-2 text-error-500 text-sm">
            Insufficient {sourceToken} balance
          </div>
        )}
      </div>

      {/* Swap Direction Button - Large, interactive as per design principles */}
      <div className="flex justify-center -my-3 relative z-10">
        <button
          onClick={handleSwapPositions}
          className="p-3 rounded-full bg-white border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
        >
          <ArrowDownIcon size={20} className="text-gray-600" />
        </button>
      </div>

              {/* Target Token Section - TO */}
        <div className="p-4 bg-gray-50 rounded-xl mt-2 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">To</span>
            <span className="text-sm text-gray-500">
              Balance: {tokensLoading ? 'Loading...' : `${safeTokenData[targetToken]?.balance || 0} ${targetToken}`}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-full bg-transparent text-token-amount outline-none text-gray-900">
              {targetTokenAmount}
            </div>
            <TokenSelector
              selectedToken={targetToken}
              onSelectToken={setTargetToken}
              disabledToken={sourceToken}
              tokenData={safeTokenData}
              isLoading={tokensLoading}
            />
          </div>
          <div className="mt-1 text-right text-sm text-gray-500">
            ≈ ${usdAmount}
          </div>
        </div>

      {/* Exchange Rate */}
      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <span>Exchange Rate</span>
        <span>
          {tokensLoading ? 'Loading...' : (
            <>
              1 {sourceToken} ≈{' '}
              {(
                (safeTokenData[sourceToken]?.usdPrice || 1) / (safeTokenData[targetToken]?.usdPrice || 1)
              ).toFixed(6)}{' '}
              {targetToken}
            </>
          )}
        </span>
      </div>

      {/* Swap Button - Prominent, elevated design with proper states */}
      <button
        onClick={executeSwap}
        disabled={swapping || !usdAmount || parseFloat(usdAmount) <= 0 || hasInsufficientBalance()}
        className={`w-full py-4 px-4 rounded-xl font-medium flex justify-center items-center min-h-[44px] transition-colors ${getButtonState()}`}
      >
        {swapping ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Swapping...
          </div>
        ) : swapComplete ? (
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Swap Successful
          </div>
        ) : (
          `Swap ${sourceToken} to ${targetToken}`
        )}
      </button>
    </div>
  )
}