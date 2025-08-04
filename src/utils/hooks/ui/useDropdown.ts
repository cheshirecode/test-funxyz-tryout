// Custom hook for dropdown state management
import { useState, useEffect, useRef } from 'react'

export interface UseDropdownReturn {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggle: () => void
  close: () => void
  dropdownRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Custom hook for managing dropdown state with click-outside functionality
 */
export function useDropdown(): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  return {
    isOpen,
    setIsOpen,
    toggle,
    close,
    dropdownRef
  }
}