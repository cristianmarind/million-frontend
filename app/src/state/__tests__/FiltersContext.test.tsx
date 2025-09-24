import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterProvider, useFilters, PROPERTY_FILTER_CONTEXT, DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE } from '../FiltersContext'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Test component to use the context
const TestComponent = () => {
  const { filters, updateFiltersByContext, clearFilersByContext } = useFilters(PROPERTY_FILTER_CONTEXT)
  
  const handleUpdate = () => {
    updateFiltersByContext(PROPERTY_FILTER_CONTEXT, {
      propertyName: 'Test Property',
      propertyAddress: 'Test Address',
      propertyPrice: [100000, 500000]
    })
  }

  const handleClear = () => {
    clearFilersByContext(PROPERTY_FILTER_CONTEXT)
  }

  return (
    <div>
      <div data-testid="filters-count">{filters.length}</div>
      <div data-testid="property-name">
        {filters.find(f => f.key === 'propertyName')?.value || ''}
      </div>
      <div data-testid="property-address">
        {filters.find(f => f.key === 'propertyAddress')?.value || ''}
      </div>
      <div data-testid="property-price">
        {JSON.stringify(filters.find(f => f.key === 'propertyPrice')?.value || [])}
      </div>
      <button onClick={handleUpdate} data-testid="update-button">Update Filters</button>
      <button onClick={handleClear} data-testid="clear-button">Clear Filters</button>
    </div>
  )
}

describe('FiltersContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  it('should provide default filter values', () => {
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )

    expect(screen.getByTestId('filters-count')).toHaveTextContent('3')
    expect(screen.getByTestId('property-name')).toHaveTextContent('')
    expect(screen.getByTestId('property-address')).toHaveTextContent('')
    expect(screen.getByTestId('property-price')).toHaveTextContent(JSON.stringify([DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]))
  })

  it('should update filters correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )

    await user.click(screen.getByTestId('update-button'))

    expect(screen.getByTestId('property-name')).toHaveTextContent('Test Property')
    expect(screen.getByTestId('property-address')).toHaveTextContent('Test Address')
    expect(screen.getByTestId('property-price')).toHaveTextContent(JSON.stringify([100000, 500000]))
  })

  it('should clear filters correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )

    // First update the filters
    await user.click(screen.getByTestId('update-button'))
    expect(screen.getByTestId('property-name')).toHaveTextContent('Test Property')

    // Then clear them
    await user.click(screen.getByTestId('clear-button'))
    expect(screen.getByTestId('property-name')).toHaveTextContent('')
    expect(screen.getByTestId('property-address')).toHaveTextContent('')
    expect(screen.getByTestId('property-price')).toHaveTextContent(JSON.stringify([DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]))
  })

  it('should persist filters to localStorage', async () => {
    const user = userEvent.setup()
    
    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )

    await user.click(screen.getByTestId('update-button'))

    // Check that localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalled()
    
    // Check the stored data
    const storedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1])
    expect(storedData).toHaveLength(3)
    expect(storedData.find((f: any) => f.key === 'propertyName')?.value).toBe('Test Property')
  })

  it('should load filters from localStorage on initialization', () => {
    // Mock localStorage with existing data
    const mockFilters = [
      {
        key: 'propertyName',
        value: 'Stored Property',
        context: PROPERTY_FILTER_CONTEXT,
        persist: true,
        defaultValue: ''
      }
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockFilters))

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    )

    expect(screen.getByTestId('property-name')).toHaveTextContent('Stored Property')
  })

  it('should throw error when useFilters is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useFilters must be used within FilterProvider')

    consoleSpy.mockRestore()
  })
})

describe('Filter utility functions', () => {
  it('should have correct default values', () => {
    expect(DEFAULT_MIN_PRICE).toBe(0)
    expect(DEFAULT_MAX_PRICE).toBe(10000000)
    expect(PROPERTY_FILTER_CONTEXT).toBe('propertiesFilter')
  })
})
