import { Loader2 } from 'lucide-react'

// Simple className merging utility
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

interface LoaderProps {
  /** Size of the loader icon */
  size?: 'sm' | 'md' | 'lg'
  /** Optional text to display alongside the loader */
  text?: string
  /** Additional CSS classes */
  className?: string
  /** Whether to show only the icon without text */
  iconOnly?: boolean
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

/**
 * Reusable loader component with spinning animation
 * Uses Loader2 icon from lucide-react with Tailwind CSS animations
 */
export const Loader = ({ size = 'md', text, className, iconOnly = false }: LoaderProps) => {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-blue-500 dark:text-blue-400', sizeMap[size])} />
      {!iconOnly && text && (
        <span className='text-sm text-gray-600 dark:text-gray-400'>{text}</span>
      )}
    </div>
  )
}

/**
 * Inline loader for buttons and small spaces
 */
export const InlineLoader = ({ size = 'sm' }: Pick<LoaderProps, 'size'>) => (
  <Loader size={size} iconOnly className='inline-flex' />
)

/**
 * Full-width loader for larger sections
 */
export const BlockLoader = ({ text = 'Loading...', size = 'md' }: LoaderProps) => (
  <div className='flex items-center justify-center py-4'>
    <Loader size={size} text={text} />
  </div>
)
