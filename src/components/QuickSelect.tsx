import React from 'react'
import { handleTokenIconError } from '@helpers'

interface QuickSelectProps {
  availableTokens: string[]
  getTokenSelectionState: (token: string) => {
    isSource: boolean
    isTarget: boolean
    isSelected: boolean
  }
  handleQuickSelect: (token: string) => void
  tokenData: Record<string, any>
}

export const QuickSelect: React.FC<QuickSelectProps> = ({
  availableTokens,
  getTokenSelectionState,
  handleQuickSelect,
  tokenData,
}) => {
  return (
    <div className='mb-4 sm:mb-6'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-base sm:text-lg font-semibold font-header text-text-light-primary dark:text-text-dark-primary'>
          Quick Select
        </h3>
        <div className='flex items-center space-x-1 sm:space-x-2 text-xs text-text-light-muted dark:text-text-dark-muted'>
          <span className='flex items-center'>
            <div className='w-1.5 sm:w-2 h-1.5 sm:h-2 bg-primary-500 rounded-full mr-1'></div>
            Source
          </span>
          <span className='flex items-center'>
            <div className='w-1.5 sm:w-2 h-1.5 sm:h-2 bg-success-500 rounded-full mr-1'></div>
            Target
          </span>
        </div>
      </div>

      <div className='overflow-x-auto scrollbar-hide'>
        <div className='flex gap-1.5 sm:gap-2 pb-2' style={{ minWidth: 'max-content' }}>
          {availableTokens.map((token) => {
            const { isSource, isTarget, isSelected } = getTokenSelectionState(token)

            return (
              <button
                key={token}
                onClick={() => handleQuickSelect(token)}
                className={`relative p-2 sm:p-3 rounded-xl min-h-[40px] sm:min-h-[44px] min-w-[70px] sm:min-w-[80px] font-medium text-xs sm:text-sm transition-colors flex flex-col items-center justify-center flex-shrink-0
                  ${
                    isSelected
                      ? 'bg-surface-light dark:bg-surface-dark border-2 border-primary-200 dark:border-primary-700 shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-text-light-secondary dark:text-text-dark-secondary hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
              >
                {/* Token Icon */}
                <img
                  src={tokenData?.[token]?.icon || ''}
                  alt={token}
                  className='w-5 h-5 sm:w-6 sm:h-6 rounded-full mb-1'
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
                  <div className='absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold'>
                    S
                  </div>
                )}
                {isTarget && (
                  <div className='absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-success-500 text-white text-xs rounded-full flex items-center justify-center font-bold'>
                    T
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className='text-center text-xs text-text-light-muted dark:text-text-dark-muted mt-2'>
        Click to select source token • Right-click to select target token • Click again to swap
        source/target
      </div>
    </div>
  )
}
