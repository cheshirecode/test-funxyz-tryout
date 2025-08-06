import { useState, useEffect, useRef, useCallback } from 'react'
import { tutorialSteps } from './data'

interface ElementPosition {
  top: number
  left: number
  width: number
  height: number
}

export const useTutorial = (isOpen: boolean, onClose: () => void) => {
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
  const updateElementPosition = useCallback(() => {
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
  }, [isActive, currentTutorialStep])

  // Handle scroll events to update highlight position
  useEffect(() => {
    if (!isActive) return

    const handleScroll = () => {
      updateElementPosition()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isActive, currentTutorialStep, updateElementPosition])

  const handleClose = useCallback(() => {
    setIsActive(false)
    setCurrentStep(0)
    setTargetElement(null)
    setTooltipPosition(null)
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [isOpen, isActive, handleClose])

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

      // Smart positioning for small elements like buttons
      const isSmallElement = position.width < 60 || position.height < 60
      const isHeaderElement = position.top < 100 // Elements in the top 100px are considered header elements

      // Special handling for header elements - always position below them
      if (isHeaderElement) {
        finalPosition = 'bottom'
      }
      // For small elements that are not in header, prefer horizontal positioning
      else if (isSmallElement) {
        if (finalPosition === 'top' || finalPosition === 'bottom') {
          // For small elements, prefer left/right positioning
          if (position.left > viewportWidth / 2) {
            finalPosition = 'left'
          } else {
            finalPosition = 'right'
          }
        }
      }

      // On mobile, prefer bottom positioning for better visibility (but not for small elements)
      if (isMobile() && finalPosition === 'top' && !isSmallElement) {
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

      // Special offset for header elements to move tooltip down by 80px
      if (isHeaderElement) {
        tooltipTop += 80
      }

      // Additional offset for network switcher to move it lower by another 80px
      if (currentTutorialStep.id === 'network-switcher') {
        tooltipTop += 120
      }

      // Adjust position if tooltip goes off-screen
      const tooltipCenterX = tooltipLeft
      const tooltipCenterY = tooltipTop

      // Check horizontal boundaries
      if (tooltipCenterX - tooltipWidth / 2 < 0) {
        // Tooltip would go off left, try alternative positions
        if (finalPosition === 'left') {
          if (isSmallElement) {
            // For small elements, try right instead
            finalPosition = 'right'
            tooltipLeft = position.left + position.width + tooltipOffset
          } else {
            tooltipLeft = tooltipWidth / 2 + 20
          }
        } else {
          tooltipLeft = tooltipWidth / 2 + 20
        }
      } else if (tooltipCenterX + tooltipWidth / 2 > viewportWidth) {
        // Tooltip would go off right, try alternative positions
        if (finalPosition === 'right') {
          if (isSmallElement) {
            // For small elements, try left instead
            finalPosition = 'left'
            tooltipLeft = position.left - tooltipOffset
          } else {
            tooltipLeft = viewportWidth - tooltipWidth / 2 - 20
          }
        } else {
          tooltipLeft = viewportWidth - tooltipWidth / 2 - 20
        }
      }

      // Check vertical boundaries and adjust position if needed
      if (tooltipCenterY - tooltipHeight / 2 < 0) {
        // Tooltip would go off top, try alternative positions
        if (finalPosition === 'top') {
          if (isHeaderElement) {
            // For header elements, always try bottom
            tooltipTop = position.top + position.height + tooltipOffset
            finalPosition = 'bottom'
          } else if (isSmallElement) {
            // For small elements, try left/right instead
            if (position.left > viewportWidth / 2) {
              finalPosition = 'left'
              tooltipTop = position.top + position.height / 2
              tooltipLeft = position.left - tooltipOffset
            } else {
              finalPosition = 'right'
              tooltipTop = position.top + position.height / 2
              tooltipLeft = position.left + position.width + tooltipOffset
            }
          } else {
            tooltipTop = position.top + position.height + tooltipOffset
            finalPosition = 'bottom'
          }
        }
      } else if (tooltipCenterY + tooltipHeight / 2 > viewportHeight) {
        // Tooltip would go off bottom, try alternative positions
        if (finalPosition === 'bottom') {
          if (isHeaderElement) {
            // For header elements, try horizontal positioning
            if (position.left > viewportWidth / 2) {
              finalPosition = 'left'
              tooltipTop = position.top + position.height / 2
              tooltipLeft = position.left - tooltipOffset
            } else {
              finalPosition = 'right'
              tooltipTop = position.top + position.height / 2
              tooltipLeft = position.left + position.width + tooltipOffset
            }
          } else if (isSmallElement) {
            // For small elements, try left/right instead
            if (position.left > viewportWidth / 2) {
              finalPosition = 'left'
              tooltipTop = position.top + position.height / 2
              tooltipLeft = position.left - tooltipOffset
            } else {
              finalPosition = 'right'
              tooltipTop = position.top + position.height / 2
              tooltipLeft = position.left + position.width + tooltipOffset
            }
          } else {
            tooltipTop = position.top - tooltipOffset
            finalPosition = 'top'
          }
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

  return {
    // State
    currentStep,
    isActive,
    targetElement,
    tooltipPosition,
    currentTutorialStep,
    isLastStep,
    isMobile,

    // Refs
    overlayRef,
    backgroundRef,

    // Actions
    handleNext,
    handlePrevious,
    handleStart,
    handleClose,
  }
}
