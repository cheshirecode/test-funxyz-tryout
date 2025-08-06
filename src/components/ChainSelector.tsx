import React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { useChain } from '@utils/hooks/chain'
import { useChainLogos } from '@utils/hooks/chain/useChainLogos'
import { useDropdown } from '@utils/hooks/ui/useDropdown'

export const ChainSelector = () => {
  const { currentChainId, setCurrentChainId, availableChains } = useChain()

  const { getChainLogo, isLoading: logosLoading } = useChainLogos()
  const { isOpen, toggle, close, dropdownRef } = useDropdown()

  const handleChainSelect = (chainId: string) => {
    setCurrentChainId(chainId)
    close()
  }

  const currentChain = availableChains.find((chain) => chain.id === currentChainId)
  const currentChainLogo = getChainLogo(currentChainId)

  // Handle image error with fallback
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.target as HTMLImageElement
    const chainId = target.getAttribute('data-chain-id')
    if (chainId) {
      const chainLogo = getChainLogo(chainId)
      if (target.src !== chainLogo.fallbackLogoUrl) {
        target.src = chainLogo.fallbackLogoUrl
      }
    }
  }

  return (
    <div className='relative' ref={dropdownRef} data-tutorial='network-switcher'>
      {/* Chain selector button */}
      <button
        onClick={toggle}
        className='flex items-center space-x-2 py-2 px-3 bg-neutral-100 dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 hover:border-primary-300 dark:hover:border-primary-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 min-h-[36px] sm:min-h-[44px] transition-all duration-200 text-text-light-primary dark:text-text-dark-primary shadow-sm hover:shadow-md'
      >
        {/* Chain logo */}
        <img
          src={currentChainLogo.logoUrl || currentChainLogo.fallbackLogoUrl}
          alt={currentChainLogo.name}
          className='w-4 h-4 rounded-full'
          data-chain-id={currentChainId}
          onError={handleImageError}
        />
        <span className='font-medium text-sm'>{currentChain?.name || currentChainLogo.name}</span>
        <ChevronDownIcon
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className='absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-neutral-600 rounded-lg shadow-lg z-50'>
          <div className='py-1'>
            {availableChains.map((chain) => {
              const chainLogo = getChainLogo(chain.id)
              return (
                <button
                  key={chain.id}
                  onClick={() => handleChainSelect(chain.id)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                    chain.isSelected
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-text-light-primary dark:text-text-dark-primary'
                  }`}
                >
                  <div className='flex items-center space-x-2'>
                    {/* Chain logo */}
                    <img
                      src={chainLogo.logoUrl || chainLogo.fallbackLogoUrl}
                      alt={chainLogo.name}
                      className='w-3 h-3 rounded-full'
                      data-chain-id={chain.id}
                      onError={handleImageError}
                    />
                    <span>{chain.name}</span>
                    {chain.isSelected && (
                      <span className='ml-auto text-xs text-primary-600 dark:text-primary-400'>
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Loading indicator for logos */}
          {logosLoading && (
            <div className='px-4 py-2 text-xs text-gray-500 text-center'>
              Loading chain information...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
