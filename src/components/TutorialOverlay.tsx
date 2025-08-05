import { useState, useEffect, useRef } from 'react'
import { X, ArrowRight } from 'lucide-react'

interface TutorialStep {
  id: string
  title: string
  description: string
  targetSelector: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'quick-select',
    title: 'Quick Token Selection',
    description:
      'Use these buttons to quickly select popular tokens like USDC, ETH, or USDT for your swap.',
    targetSelector: '[data-tutorial="quick-select"]',
    position: 'bottom',
  },
  {
    id: 'amount-input',
    title: 'USD Amount Input',
    description:
      'Enter the USD amount you want to swap. The system will automatically calculate the equivalent token amounts.',
    targetSelector: '[data-tutorial="amount-input"]',
    position: 'bottom',
  },
  {
    id: 'source-token',
    title: 'Source Token (From)',
    description: "Select the token you want to swap from. This is what you're selling.",
    targetSelector: '[data-tutorial="source-token"]',
    position: 'right',
  },
  {
    id: 'swap-direction',
    title: 'Swap Direction',
    description:
      'Click this button to quickly swap the positions of your source and target tokens.',
    targetSelector: '[data-tutorial="swap-direction"]',
    position: 'left',
  },
  {
    id: 'target-token',
    title: 'Target Token (To)',
    description: "Select the token you want to swap to. This is what you're buying.",
    targetSelector: '[data-tutorial="target-token"]',
    position: 'left',
  },
  {
    id: 'exchange-rate',
    title: 'Exchange Rate & Pricing',
    description: 'View real-time exchange rates, gas prices, and estimated costs for your swap.',
    targetSelector: '[data-tutorial="exchange-rate"]',
    position: 'top',
  },
  {
    id: 'swap-button',
    title: 'Execute Swap',
    description: 'Review your swap details and click here to execute the transaction.',
    targetSelector: '[data-tutorial="swap-button"]',
    position: 'top',
  },
]

interface TutorialOverlayProps {
  isOpen: boolean
  onClose: () => void
}

interface ElementPosition {
  top: number
  left: number
  width: number
  height: number
}

export const TutorialOverlay = ({ isOpen, onClose }: TutorialOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [targetElement, setTargetElement] = useState<ElementPosition | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  const currentTutorialStep = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1

  // Check if device is mobile
  const isMobile = () => {
    return window.innerWidth <= 768
  }

  // Update element position on scroll
  const updateElementPosition = () => {
    if (!isActive || !currentTutorialStep) return

    const element = document.querySelector(currentTutorialStep.targetSelector)
    if (!element) return

    const rect = element.getBoundingClientRect()
    const position: ElementPosition = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }

    setTargetElement(position)
  }

  // Handle scroll events to update highlight position
  useEffect(() => {
    if (!isActive) return

    const handleScroll = () => {
      updateElementPosition()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isActive, currentTutorialStep])

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen || !isActive) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      // Check if click is on the background overlay specifically
      if (backgroundRef.current && backgroundRef.current.contains(target)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, isActive])

  // Find and position the target element
  useEffect(() => {
    if (!isActive) return

    const findTargetElement = () => {
      const element = document.querySelector(currentTutorialStep.targetSelector)
      if (!element) {
        console.warn(`Target element not found: ${currentTutorialStep.targetSelector}`)
        return
      }

      const rect = element.getBoundingClientRect()
      const position: ElementPosition = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }

      setTargetElement(position)

      // Scroll to the highlighted element
      const scrollToElement = () => {
        const elementTop = rect.top + window.scrollY
        const elementBottom = rect.bottom + window.scrollY
        const viewportHeight = window.innerHeight
        const currentScrollY = window.scrollY

        // Calculate the center of the element
        const elementCenter = elementTop + rect.height / 2

        // If element is not in view, scroll to it
        if (elementTop < currentScrollY || elementBottom > currentScrollY + viewportHeight) {
          const targetScrollY = elementCenter - viewportHeight / 2
          window.scrollTo({
            top: Math.max(0, targetScrollY),
            behavior: 'smooth',
          })
        }
      }

      // Scroll after a small delay to ensure positioning is complete
      setTimeout(scrollToElement, 150)

      // Calculate tooltip position with viewport boundary detection
      const tooltipOffset = isMobile() ? 10 : 20
      const tooltipWidth = isMobile() ? 280 : 320 // Smaller on mobile
      const tooltipHeight = isMobile() ? 180 : 200 // Smaller on mobile
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let tooltipTop = 0
      let tooltipLeft = 0
      let finalPosition = currentTutorialStep.position

      // On mobile, prefer bottom positioning for better visibility
      if (isMobile() && finalPosition === 'top') {
        finalPosition = 'bottom'
      }

      // Calculate initial position based on step preference
      switch (finalPosition) {
        case 'top':
          tooltipTop = position.top - tooltipOffset
          tooltipLeft = position.left + position.width / 2
          break
        case 'bottom':
          tooltipTop = position.top + position.height + tooltipOffset
          tooltipLeft = position.left + position.width / 2
          break
        case 'left':
          tooltipTop = position.top + position.height / 2
          tooltipLeft = position.left - tooltipOffset
          break
        case 'right':
          tooltipTop = position.top + position.height / 2
          tooltipLeft = position.left + position.width + tooltipOffset
          break
      }

      // Adjust position if tooltip goes off-screen
      const tooltipCenterX = tooltipLeft
      const tooltipCenterY = tooltipTop

      // Check horizontal boundaries
      if (tooltipCenterX - tooltipWidth / 2 < 0) {
        tooltipLeft = tooltipWidth / 2 + 20
      } else if (tooltipCenterX + tooltipWidth / 2 > viewportWidth) {
        tooltipLeft = viewportWidth - tooltipWidth / 2 - 20
      }

      // Check vertical boundaries and adjust position if needed
      if (tooltipCenterY - tooltipHeight / 2 < 0) {
        // Tooltip would go off top, try bottom instead
        if (finalPosition === 'top') {
          tooltipTop = position.top + position.height + tooltipOffset
          finalPosition = 'bottom'
        }
      } else if (tooltipCenterY + tooltipHeight / 2 > viewportHeight) {
        // Tooltip would go off bottom, try top instead
        if (finalPosition === 'bottom') {
          tooltipTop = position.top - tooltipOffset
          finalPosition = 'top'
        }
      }

      // Final boundary check
      if (tooltipTop - tooltipHeight / 2 < 0) {
        tooltipTop = tooltipHeight / 2 + 20
      } else if (tooltipTop + tooltipHeight / 2 > viewportHeight) {
        tooltipTop = viewportHeight - tooltipHeight / 2 - 20
      }

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft })
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(findTargetElement, 100)
    return () => clearTimeout(timer)
  }, [currentStep, isActive, currentTutorialStep])

  const handleNext = () => {
    if (isLastStep) {
      onClose()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const handleStart = () => {
    setIsActive(true)
  }

  const handleClose = () => {
    setIsActive(false)
    setCurrentStep(0)
    setTargetElement(null)
    setTooltipPosition(null)
    onClose()
  }

  if (!isOpen) return null

  if (!isActive) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md mx-4 shadow-xl'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
              Welcome to Token Swap Tutorial
            </h2>
            <button
              onClick={handleClose}
              className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <X size={20} className='text-gray-500' />
            </button>
          </div>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6'>
            Learn how to use the token swap interface step by step. We'll highlight each feature and
            explain how it works.
          </p>
          <div className='flex gap-2'>
            <button
              onClick={handleStart}
              className='flex-1 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base'
            >
              Start Tutorial
            </button>
            <button
              onClick={handleClose}
              className='px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base'
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!targetElement || !tooltipPosition) {
    return (
      <div className='fixed inset-0 z-50'>
        <div className='absolute inset-0 bg-black bg-opacity-50' />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-4'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='fixed inset-0 z-50' ref={overlayRef}>
      {/* Overlay background */}
      <div ref={backgroundRef} className='absolute inset-0 bg-black bg-opacity-50 cursor-pointer' />

      {/* Tutorial step */}
      <div className='absolute inset-0 pointer-events-none'>
        {/* Highlight target element */}
        <div
          className='fixed border-2 border-blue-500 bg-blue-500 bg-opacity-10 rounded-lg pointer-events-none transition-all duration-300'
          style={{
            top: targetElement.top,
            left: targetElement.left,
            width: targetElement.width,
            height: targetElement.height,
            zIndex: 1,
          }}
        />

        {/* Tutorial tooltip */}
        <div
          className='absolute bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-xl max-w-xs sm:max-w-sm pointer-events-auto transition-all duration-300'
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
          }}
        >
          <div className='flex items-start justify-between mb-2'>
            <h3 className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
              {currentTutorialStep.title}
            </h3>
            <button
              onClick={handleClose}
              className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-2'
            >
              <X size={16} className='text-gray-500' />
            </button>
          </div>
          <p className='text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4'>
            {currentTutorialStep.description}
          </p>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-gray-500'>
              {currentStep + 1} of {tutorialSteps.length}
            </div>
            <div className='flex gap-1 sm:gap-2'>
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className='px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className='px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1'
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ArrowRight size={12} className='sm:w-3 sm:h-3' />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
