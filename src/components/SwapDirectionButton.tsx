import React from 'react'
import { ArrowDownIcon } from 'lucide-react'

interface SwapDirectionButtonProps {
  onClick: () => void
}

export const SwapDirectionButton: React.FC<SwapDirectionButtonProps> = ({ onClick }) => {
  return (
    <div className='flex justify-center -my-3 relative z-10'>
      <button
        onClick={onClick}
        className='p-3 rounded-full bg-surface-light dark:bg-surface-dark border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors'
      >
        <ArrowDownIcon
          size={20}
          className='text-text-light-secondary dark:text-text-dark-secondary'
        />
      </button>
    </div>
  )
}
