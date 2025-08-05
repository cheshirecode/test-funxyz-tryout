import { ChevronDownIcon } from 'lucide-react'
import { type TokenData } from '@utils/tokenData'
import { useDropdown } from '@hooks/ui'
import { handleTokenIconError, formatTokenBalance } from '@helpers'
import { BlockLoader } from './Loader'

interface TokenSelectorProps {
  selectedToken: string
  onSelectToken: (token: string) => void
  disabledToken?: string
  tokenData: Record<string, TokenData>
  isLoading?: boolean
}

export const TokenSelector = ({
  selectedToken,
  onSelectToken,
  disabledToken,
  tokenData,
  isLoading = false,
}: TokenSelectorProps) => {
  const { isOpen, toggle, close, dropdownRef } = useDropdown()

  const handleTokenSelect = (token: string) => {
    onSelectToken(token)
    close()
  }

  return (
    <div className='relative ml-4' ref={dropdownRef}>
      {/* Token selector button - 44px min height for touch targets */}
      <button
        onClick={toggle}
        className='flex items-center space-x-2 py-2 px-3 bg-neutral-100 dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 hover:border-primary-300 dark:hover:border-primary-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 min-h-[44px] transition-all duration-200 text-text-light-primary dark:text-text-dark-primary shadow-sm hover:shadow-md'
      >
        <img
          src={tokenData[selectedToken]?.icon || ''}
          alt={selectedToken}
          className='w-6 h-6 rounded-full'
          onError={(e) => handleTokenIconError(e, selectedToken, 24)}
        />
        <span className='font-medium text-sm'>{selectedToken}</span>
        <ChevronDownIcon
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu - Right-aligned for mobile optimization */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-600 z-20 py-2 ring-1 ring-black/5 dark:ring-white/10'>
          {isLoading ? (
            <BlockLoader text='Loading tokens...' />
          ) : (
            Object.keys(tokenData).map((token) => (
              <button
                key={token}
                onClick={() => handleTokenSelect(token)}
                disabled={token === disabledToken}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-600 min-h-[44px] transition-all duration-150 hover:shadow-sm
                ${token === disabledToken ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
                ${token === selectedToken ? 'bg-primary-50 dark:bg-primary-900/30 border-r-4 border-primary-500 shadow-sm' : ''}`}
              >
                <img
                  src={tokenData[token].icon}
                  alt={token}
                  className='w-8 h-8 rounded-full mr-3'
                  onError={(e) => handleTokenIconError(e, token, 32)}
                />
                <div className='flex-1'>
                  <div className='font-medium text-text-light-primary dark:text-text-dark-primary'>
                    {token}
                  </div>
                  <div className='text-sm text-text-light-secondary dark:text-text-dark-secondary'>
                    {tokenData[token].name}
                  </div>
                  <div className='text-xs text-text-light-muted dark:text-text-dark-muted'>
                    {formatTokenBalance(tokenData[token].balance, token, isLoading)}
                  </div>
                </div>
                {token === selectedToken && (
                  <div className='w-2 h-2 bg-primary-500 rounded-full'></div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
