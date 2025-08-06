export interface TutorialStep {
  id: string
  title: string
  description: string
  targetSelector: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

export interface TutorialState {
  isActive: boolean
  currentStepIndex: number
  targetElement: {
    top: number
    left: number
    width: number
    height: number
  }
}

export interface TutorialOverlayProps {
  isVisible: boolean
  onClose: () => void
}
