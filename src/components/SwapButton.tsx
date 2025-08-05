import React from 'react'

interface SwapButtonProps {
  onClick: () => void
  disabled: boolean
  isSwapping: boolean
  swapComplete: boolean
  buttonText: string
  className: string
}

export const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  disabled,
  isSwapping,
  swapComplete,
  buttonText,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isSwapping}
      className={`w-full py-4 px-4 rounded-xl font-medium flex justify-center items-center min-h-[44px] transition-colors ${className}`}
    >
      {isSwapping ? (
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
        buttonText
      )}
    </button>
  )
}
