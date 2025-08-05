import React from 'react'
import { TokenSelector } from './TokenSelector'
import { ContractInfo } from './ContractInfo'
import { getBalanceTextStyle, formatTokenBalance } from '@helpers'

interface TokenSwapSectionProps {
  type: 'source' | 'target'
  selectedToken: string
  onSelectToken: (token: string) => void
  disabledToken: string
  tokenData: Record<string, any>
  tokenAmount: string
  isLoading: boolean
  canExecuteSwap?: boolean
}

export const TokenSwapSection: React.FC<TokenSwapSectionProps> = ({
  type,
  selectedToken,
  onSelectToken,
  disabledToken,
  tokenData,
  tokenAmount,
  isLoading,
  canExecuteSwap = true,
}) => {
  const isSource = type === 'source'
  const indicatorColor = isSource ? 'bg-primary-500' : 'bg-success-500'
  const textColor = isSource
    ? 'text-primary-600 dark:text-primary-400'
    : 'text-success-600 dark:text-success-400'
  const label = isSource ? 'From' : 'To'

  return (
    <div className='p-3 sm:p-4 bg-surface-light-secondary dark:bg-surface-dark-secondary rounded-xl border border-neutral-200 dark:border-neutral-700'>
      <div className='flex justify-between mb-2'>
        <div className='flex items-center'>
          <div className={`w-2 h-2 ${indicatorColor} rounded-full mr-2`}></div>
          <span className={`text-xs sm:text-sm font-medium ${textColor}`}>{label}</span>
        </div>
        <span
          className={`text-xs sm:text-sm ${
            isSource
              ? getBalanceTextStyle(tokenAmount, selectedToken, tokenData)
              : 'text-text-light-muted dark:text-text-dark-muted'
          }`}
        >
          Balance:{' '}
          {formatTokenBalance(tokenData?.[selectedToken]?.balance || 0, selectedToken, isLoading)}
        </span>
      </div>

      {/* Token Amount Display */}
      <div className='flex items-center'>
        <div className='w-full bg-transparent text-token-amount outline-none text-text-light-primary dark:text-text-dark-primary'>
          {tokenAmount}
        </div>
        <TokenSelector
          selectedToken={selectedToken}
          onSelectToken={onSelectToken}
          disabledToken={disabledToken}
          tokenData={tokenData}
          isLoading={isLoading}
        />
      </div>

      {/* Contract Information */}
      <div className='mt-2 flex justify-between items-center'>
        <ContractInfo
          contractAddress={tokenData?.[selectedToken]?.contractAddress}
          chainId={tokenData?.[selectedToken]?.chainId}
          symbol={selectedToken}
        />
      </div>

      {/* Error Message for Source Token */}
      {isSource &&
        !canExecuteSwap &&
        getBalanceTextStyle(tokenAmount, selectedToken, tokenData) === 'text-error-500' && (
          <div className='mt-2 text-error-500 text-xs sm:text-sm'>
            Insufficient {selectedToken} balance
          </div>
        )}
    </div>
  )
}
