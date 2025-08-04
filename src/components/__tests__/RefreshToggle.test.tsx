import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { RefreshToggle, useRefreshRate, type RefreshRate } from '../RefreshToggle'

describe('RefreshToggle Component', () => {
  const mockOnRefreshRateChange = vi.fn()

  beforeEach(() => {
    mockOnRefreshRateChange.mockClear()
  })

  it('renders with disabled state by default', () => {
    render(
      <RefreshToggle
        refreshRate="disabled"
        onRefreshRateChange={mockOnRefreshRateChange}
      />
    )

    const button = screen.getByRole('button', { name: /auto-refresh disabled/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-gray-400', 'bg-gray-100')
    
    // Should not show overlay text for disabled state
    expect(screen.queryByText('disabled')).not.toBeInTheDocument()
  })

  it('renders with 5s state and shows overlay', () => {
    render(
      <RefreshToggle
        refreshRate="5s"
        onRefreshRateChange={mockOnRefreshRateChange}
      />
    )

    const button = screen.getByRole('button', { name: /auto-refresh every 5 seconds/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-green-600', 'bg-green-100')
    
    // Should show overlay text for 5s state
    expect(screen.getByText('5s')).toBeInTheDocument()
  })

  it('renders with 30s state and shows overlay', () => {
    render(
      <RefreshToggle
        refreshRate="30s"
        onRefreshRateChange={mockOnRefreshRateChange}
      />
    )

    const button = screen.getByRole('button', { name: /auto-refresh every 30 seconds/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-blue-600', 'bg-blue-100')
    
    // Should show overlay text for 30s state
    expect(screen.getByText('30s')).toBeInTheDocument()
  })

  it('cycles through states when clicked: disabled → 5s → 30s → disabled', () => {
    const { rerender } = render(
      <RefreshToggle
        refreshRate="disabled"
        onRefreshRateChange={mockOnRefreshRateChange}
      />
    )

    const button = screen.getByRole('button')

    // Click 1: disabled → 5s
    fireEvent.click(button)
    expect(mockOnRefreshRateChange).toHaveBeenCalledWith('5s')

    // Update props to reflect state change
    rerender(
      <RefreshToggle
        refreshRate="5s"
        onRefreshRateChange={mockOnRefreshRateChange}
      />
    )

    // Click 2: 5s → 30s
    fireEvent.click(button)
    expect(mockOnRefreshRateChange).toHaveBeenCalledWith('30s')

    // Update props to reflect state change
    rerender(
      <RefreshToggle
        refreshRate="30s"
        onRefreshRateChange={mockOnRefreshRateChange}
      />
    )

    // Click 3: 30s → disabled
    fireEvent.click(button)
    expect(mockOnRefreshRateChange).toHaveBeenCalledWith('disabled')

    expect(mockOnRefreshRateChange).toHaveBeenCalledTimes(3)
  })

  it('shows loading state when isLoading is true', () => {
    render(
      <RefreshToggle
        refreshRate="5s"
        onRefreshRateChange={mockOnRefreshRateChange}
        isLoading={true}
      />
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('does not call onRefreshRateChange when disabled', () => {
    render(
      <RefreshToggle
        refreshRate="5s"
        onRefreshRateChange={mockOnRefreshRateChange}
        isLoading={true}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOnRefreshRateChange).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <RefreshToggle
        refreshRate="disabled"
        onRefreshRateChange={mockOnRefreshRateChange}
        className="custom-class"
      />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('useRefreshRate Hook', () => {
  const TestComponent = ({ initialRate }: { initialRate?: RefreshRate }) => {
    const { refreshRate, setRefreshRate, refreshInterval, staleTime } = useRefreshRate(initialRate)

    return (
      <div>
        <span data-testid="refresh-rate">{refreshRate}</span>
        <span data-testid="refresh-interval">{refreshInterval.toString()}</span>
        <span data-testid="stale-time">{staleTime}</span>
        <button onClick={() => setRefreshRate('5s')}>Set 5s</button>
        <button onClick={() => setRefreshRate('30s')}>Set 30s</button>
        <button onClick={() => setRefreshRate('disabled')}>Set disabled</button>
      </div>
    )
  }

  it('initializes with default disabled state', () => {
    render(<TestComponent />)

    expect(screen.getByTestId('refresh-rate')).toHaveTextContent('disabled')
    expect(screen.getByTestId('refresh-interval')).toHaveTextContent('false')
    expect(screen.getByTestId('stale-time')).toHaveTextContent('300000') // 5 minutes
  })

  it('initializes with custom initial rate', () => {
    render(<TestComponent initialRate="5s" />)

    expect(screen.getByTestId('refresh-rate')).toHaveTextContent('5s')
    expect(screen.getByTestId('refresh-interval')).toHaveTextContent('5000') // 5 seconds
    expect(screen.getByTestId('stale-time')).toHaveTextContent('2000') // 2 seconds
  })

  it('returns correct intervals for 5s rate', () => {
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Set 5s'))

    expect(screen.getByTestId('refresh-rate')).toHaveTextContent('5s')
    expect(screen.getByTestId('refresh-interval')).toHaveTextContent('5000') // 5 seconds
    expect(screen.getByTestId('stale-time')).toHaveTextContent('2000') // 2 seconds
  })

  it('returns correct intervals for 30s rate', () => {
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Set 30s'))

    expect(screen.getByTestId('refresh-rate')).toHaveTextContent('30s')
    expect(screen.getByTestId('refresh-interval')).toHaveTextContent('30000') // 30 seconds
    expect(screen.getByTestId('stale-time')).toHaveTextContent('15000') // 15 seconds
  })

  it('returns correct intervals for disabled rate', () => {
    render(<TestComponent initialRate="5s" />)

    fireEvent.click(screen.getByText('Set disabled'))

    expect(screen.getByTestId('refresh-rate')).toHaveTextContent('disabled')
    expect(screen.getByTestId('refresh-interval')).toHaveTextContent('false')
    expect(screen.getByTestId('stale-time')).toHaveTextContent('300000') // 5 minutes
  })
})

describe('RefreshToggle Integration', () => {
  const IntegrationTestComponent = () => {
    const { refreshRate, setRefreshRate, refreshInterval, staleTime } = useRefreshRate('disabled')

    return (
      <div>
        <RefreshToggle
          refreshRate={refreshRate}
          onRefreshRateChange={setRefreshRate}
        />
        <div data-testid="current-interval">{refreshInterval.toString()}</div>
        <div data-testid="current-stale-time">{staleTime}</div>
      </div>
    )
  }

  it('integrates hook and component correctly', async () => {
    render(<IntegrationTestComponent />)

    const button = screen.getByRole('button')
    
    // Initial state - disabled
    expect(screen.getByTestId('current-interval')).toHaveTextContent('false')
    expect(screen.getByTestId('current-stale-time')).toHaveTextContent('300000')

    // Click to 5s
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByTestId('current-interval')).toHaveTextContent('5000')
      expect(screen.getByTestId('current-stale-time')).toHaveTextContent('2000')
      expect(screen.getByText('5s')).toBeInTheDocument()
    })

    // Click to 30s
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByTestId('current-interval')).toHaveTextContent('30000')
      expect(screen.getByTestId('current-stale-time')).toHaveTextContent('15000')
      expect(screen.getByText('30s')).toBeInTheDocument()
    })

    // Click back to disabled
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByTestId('current-interval')).toHaveTextContent('false')
      expect(screen.getByTestId('current-stale-time')).toHaveTextContent('300000')
      expect(screen.queryByText('30s')).not.toBeInTheDocument()
    })
  })
})