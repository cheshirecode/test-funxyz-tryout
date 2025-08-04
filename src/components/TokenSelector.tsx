import { useEffect, useState, useRef } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { tokenData } from '../utils/tokenData'

interface TokenSelectorProps {
  selectedToken: string
  onSelectToken: (token: string) => void
  disabledToken?: string
}

export const TokenSelector = ({
  selectedToken,
  onSelectToken,
  disabledToken,
}: TokenSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleTokenSelect = (token: string) => {
    onSelectToken(token)
    setIsOpen(false)
  }

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      {/* Token selector button - 44px min height for touch targets */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 min-h-[44px] transition-colors"
      >
        <img
          src={tokenData[selectedToken].icon}
          alt={selectedToken}
          className="w-6 h-6 rounded-full"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' text-anchor='middle' font-size='8'%3E${selectedToken.charAt(0)}%3C/text%3E%3C/svg%3E`
          }}
        />
        <span className="font-medium text-sm">{selectedToken}</span>
        <ChevronDownIcon
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu - Right-aligned for mobile optimization */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-20 border border-gray-100 py-2">
          {Object.keys(tokenData).map((token) => (
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
                className="w-8 h-8 rounded-full mr-3"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' text-anchor='middle' font-size='8'%3E${token.charAt(0)}%3C/text%3E%3C/svg%3E`
                }}
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{token}</div>
                <div className="text-sm text-gray-500">
                  {tokenData[token].name}
                </div>
                <div className="text-xs text-gray-400">
                  Balance: {tokenData[token].balance}
                </div>
              </div>
              {token === selectedToken && (
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}