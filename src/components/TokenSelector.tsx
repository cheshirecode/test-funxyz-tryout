import { ChevronDownIcon } from 'lucide-react'
import { type TokenData } from '@utils/tokenData'
import { useDropdown } from '@hooks/ui'
import { handleTokenIconError, formatTokenBalance } from '@helpers'

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
        className='flex items-center space-x-2 py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 min-h-[44px] transition-colors'
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
        <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-20 border border-gray-100 py-2'>
          {isLoading ? (
            <div className='px-4 py-3 text-sm text-gray-500'>Loading tokens...</div>
          ) : (
            Object.keys(tokenData).map((token) => (
              <button
                key={token}
                onClick={() => handleTokenSelect(token)}
                disabled={token === disabledToken}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 min-h-[44px] transition-colors
                ${token === disabledToken ? 'opacity-50 cursor-not-allowed' : ''}
                ${token === selectedToken ? 'bg-primary-50 border-r-2 border-primary-500' : ''}`}
              >
                <img
                  src={tokenData[token].icon}
                  alt={token}
                  className='w-8 h-8 rounded-full mr-3'
                  onError={(e) => handleTokenIconError(e, token, 32)}
                />
                <div className='flex-1'>
                  <div className='font-medium text-gray-900'>{token}</div>
                  <div className='text-sm text-gray-500'>{tokenData[token].name}</div>
                  <div className='text-xs text-gray-400'>
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
