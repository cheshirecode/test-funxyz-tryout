import React from 'react'

interface AmountInputProps {
  usdAmount: string
  setUsdAmount: (amount: string) => void
}

export const AmountInput: React.FC<AmountInputProps> = ({ usdAmount, setUsdAmount }) => {
  return (
    <div className='p-4 sm:p-6 bg-surface-light dark:bg-surface-dark rounded-xl mb-4 sm:mb-6 border border-neutral-200 dark:border-neutral-700 shadow-sm'>
      <div className='text-center mb-3 sm:mb-4'>
        <h3 className='text-base sm:text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-2'>
          Enter Amount
        </h3>
        <div className='text-xs sm:text-sm text-text-light-muted dark:text-text-dark-muted'>
          Specify the USD value to swap
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <span className='text-xl sm:text-2xl font-medium text-text-light-muted dark:text-text-dark-muted mr-2 sm:mr-3'>
          $
        </span>
        <input
          type='number'
          value={usdAmount}
          onChange={(e) => setUsdAmount(e.target.value)}
          className='bg-transparent text-3xl sm:text-4xl font-bold text-center outline-none text-text-light-primary dark:text-text-dark-primary placeholder-text-light-muted dark:placeholder-text-dark-muted min-w-0 flex-1 max-w-xs focus:ring-2 focus:ring-primary-500/30 dark:focus:ring-primary-400/30 rounded-lg px-2 py-1 transition-all duration-200'
          placeholder='0.00'
          step='0.01'
        />
      </div>
    </div>
  )
}
