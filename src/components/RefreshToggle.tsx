import React from 'react'
import { RotateCcw } from 'lucide-react'
import { RefreshRate, getRefreshConfig, getNextRefreshRate } from '../utils/refresh'

interface RefreshToggleProps {
  /** Current refresh rate */
  refreshRate: RefreshRate
  /** Callback when refresh rate changes */
  onRefreshRateChange: (rate: RefreshRate) => void
  /** Additional CSS classes */
  className?: string
  /** Show loading state */
  isLoading?: boolean
}

/**
 * RefreshToggle component that cycles through refresh rates: disabled → 5s → 30s → disabled
 * Shows visual feedback with overlay text for active refresh rates
 * Now uses refactored utilities for cleaner logic
 */
export const RefreshToggle: React.FC<RefreshToggleProps> = ({
  refreshRate,
  onRefreshRateChange,
  className = '',
  isLoading = false,
}) => {
  const config = getRefreshConfig(refreshRate)

  const handleClick = () => {
    const nextRate = getNextRefreshRate(refreshRate)
    onRefreshRateChange(nextRate)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          relative flex items-center justify-center
          w-8 h-8 rounded-lg border-2 border-transparent
          transition-all duration-200 ease-in-out
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${config.color} ${config.bgColor}
        `}
        title={config.label}
        aria-label={config.label}
      >
        <RotateCcw
          className={`w-4 h-4 transition-transform duration-300 ${
            isLoading ? 'animate-spin' : ''
          }`}
        />

        {/* Overlay text for active refresh rates */}
        {config.showOverlay && (
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm px-1">
            <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
              {refreshRate}
            </span>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
          </div>
        )}
      </button>
    </div>
  )
}

// Re-export the refactored hook for backward compatibility
export { useRefreshControl as useRefreshRate } from '../utils/hooks/refresh'