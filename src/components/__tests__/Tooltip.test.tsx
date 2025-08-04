// Tests for Tooltip component
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from '../Tooltip'

describe('Tooltip Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render children correctly', () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
    })

    it('should not show tooltip by default', () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument()
    })

    it('should apply custom className to wrapper', () => {
      const { container } = render(
        <Tooltip content='Test tooltip' className='custom-class'>
          <button>Test Button</button>
        </Tooltip>
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Mouse Interactions', () => {
    it('should show tooltip on mouse enter', async () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
        expect(screen.getByText('Test tooltip')).toBeInTheDocument()
      })
    })

    it('should hide tooltip on mouse leave', async () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')

      // Show tooltip
      fireEvent.mouseEnter(button)
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      // Hide tooltip
      fireEvent.mouseLeave(button)
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      })
    })
  })

  describe('Keyboard Interactions', () => {
    it('should show tooltip on focus', async () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.focus(button)

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
        expect(screen.getByText('Test tooltip')).toBeInTheDocument()
      })
    })

    it('should hide tooltip on blur', async () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')

      // Show tooltip
      fireEvent.focus(button)
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      // Hide tooltip
      fireEvent.blur(button)
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      })
    })
  })

  describe('Positioning', () => {
    it('should apply bottom position by default', async () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveClass('top-full', 'left-1/2', '-translate-x-1/2', 'mt-2')
      })
    })

    it('should apply top position when specified', async () => {
      render(
        <Tooltip content='Test tooltip' position='top'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveClass('bottom-full', 'left-1/2', '-translate-x-1/2', 'mb-2')
      })
    })

    it('should apply left position when specified', async () => {
      render(
        <Tooltip content='Test tooltip' position='left'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveClass('right-full', 'top-1/2', '-translate-y-1/2', 'mr-2')
      })
    })

    it('should apply right position when specified', async () => {
      render(
        <Tooltip content='Test tooltip' position='right'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveClass('left-full', 'top-1/2', '-translate-y-1/2', 'ml-2')
      })
    })
  })

  describe('Arrow Indicators', () => {
    it('should render arrow for bottom position', async () => {
      render(
        <Tooltip content='Test tooltip' position='bottom'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        const arrow = tooltip.querySelector('.border-b-neutral-800')
        expect(arrow).toBeInTheDocument()
      })
    })

    it('should render arrow for top position', async () => {
      render(
        <Tooltip content='Test tooltip' position='top'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        const arrow = tooltip.querySelector('.border-t-neutral-800')
        expect(arrow).toBeInTheDocument()
      })
    })
  })

  describe('Content Variations', () => {
    it('should render simple text content', async () => {
      render(
        <Tooltip content='Simple tooltip text'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        expect(screen.getByText('Simple tooltip text')).toBeInTheDocument()
      })
    })

    it('should render long text content without wrapping by default', async () => {
      const longText = 'This is a very long tooltip text that should not wrap by default'

      render(
        <Tooltip content={longText}>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveClass('whitespace-nowrap')
        expect(screen.getByText(longText)).toBeInTheDocument()
      })
    })

    it('should render empty content gracefully', async () => {
      render(
        <Tooltip content=''>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toBeInTheDocument()
        expect(tooltip).toHaveTextContent('')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA role', async () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()

      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')

      // Use keyboard to focus
      await user.tab()
      expect(button).toHaveFocus()

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      // Use keyboard to blur
      await user.tab()
      expect(button).not.toHaveFocus()

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      })
    })
  })

  describe('Theme Support', () => {
    it('should apply dark theme classes in tooltip', async () => {
      // Mock dark theme by adding class to document
      document.documentElement.classList.add('dark')

      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveClass('dark:bg-neutral-200', 'dark:text-neutral-800')
      })

      // Cleanup
      document.documentElement.classList.remove('dark')
    })

    it('should have proper contrast in light theme', async () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveClass('bg-neutral-800', 'text-white')
      })
    })
  })

  describe('Animation', () => {
    it('should have fade-in animation class', async () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveClass('animate-fade-in')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid mouse enter/leave events', async () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')

      // Rapid mouse events
      fireEvent.mouseEnter(button)
      fireEvent.mouseLeave(button)
      fireEvent.mouseEnter(button)
      fireEvent.mouseLeave(button)
      fireEvent.mouseEnter(button)

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })

    it('should handle focus and mouse events together', async () => {
      render(
        <Tooltip content='Test tooltip'>
          <button>Test Button</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')

      // Focus first
      fireEvent.focus(button)
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      // Mouse enter while focused
      fireEvent.mouseEnter(button)
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      // Mouse leave - current implementation will hide tooltip even if focused
      // This tests the current behavior, not ideal accessibility behavior
      fireEvent.mouseLeave(button)
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      })

      // Focus again to show tooltip
      fireEvent.focus(button)
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })

      // Blur to hide
      fireEvent.blur(button)
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      })
    })
  })
})
