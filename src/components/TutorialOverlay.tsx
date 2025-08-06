import { X, ArrowRight } from 'lucide-react'
import { useTutorial } from '../features/tutorial'

interface TutorialOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export const TutorialOverlay = ({ isOpen, onClose }: TutorialOverlayProps) => {
  const {
    currentStep,
    isActive,
    targetElement,
    tooltipPosition,
    currentTutorialStep,
    isLastStep,
    overlayRef,
    backgroundRef,
    handleNext,
    handlePrevious,
    handleStart,
    handleClose,
  } = useTutorial(isOpen, onClose)

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
      {/* Subtle blurred overlay background */}
      <div
        ref={backgroundRef}
        className='absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm cursor-pointer'
        style={{
          filter: 'blur(1px)',
        }}
      />

      {/* Tutorial step */}
      <div className='absolute inset-0 pointer-events-none'>
        {/* Clear cutout for highlighted element */}
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
              {currentStep + 1} of {currentTutorialStep ? 9 : 0}
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
