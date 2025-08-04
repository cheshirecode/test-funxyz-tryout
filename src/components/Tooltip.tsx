import { ReactNode, useState } from 'react'

interface TooltipProps {
  children: ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Tooltip = ({
  children,
  content,
  position = 'bottom',
  className = '',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-neutral-800 dark:border-t-neutral-200',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-neutral-800 dark:border-b-neutral-200',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-neutral-800 dark:border-l-neutral-200',
    right:
      'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-neutral-800 dark:border-r-neutral-200',
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-neutral-800 dark:bg-neutral-200 dark:text-neutral-800 rounded-lg shadow-lg whitespace-nowrap animate-fade-in ${positionClasses[position]}`}
          role='tooltip'
        >
          {content}
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  )
}
