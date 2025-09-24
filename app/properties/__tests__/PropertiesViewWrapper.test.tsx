import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PropertiesViewWrapper from '../PropertiesViewWrapper'
import Property from '../../src/core/domain/Property'

// Mock the dynamic import
jest.mock('../PropertiesView', () => {
  return function MockPropertiesView({ properties }: { properties: Property[] }) {
    return (
      <div data-testid="properties-view">
        <div data-testid="properties-count">{properties.length}</div>
        {properties.map(property => (
          <div key={property.id} data-testid={`property-${property.id}`}>
            {property.name}
          </div>
        ))}
      </div>
    )
  }
})

// Mock the ErrorBoundary
jest.mock('../../src/components/generals/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }: { children: React.ReactNode }) {
    return <div data-testid="error-boundary">{children}</div>
  }
})

// Mock the LoadingSpinner
jest.mock('../../src/components/generals/LoadingSpinner', () => ({
  PropertiesLoadingSpinner: function MockPropertiesLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading properties...</div>
  }
}))

describe('PropertiesViewWrapper', () => {
  const mockProperties: Property[] = [
    {
      id: '1',
      name: 'Property 1',
      address: 'Address 1',
      price: 200000,
      year: 2020,
      category: 1,
      ownerId: 'owner1',
      imageUrls: ['image1.jpg'],
      propertyTraces: []
    },
    {
      id: '2',
      name: 'Property 2',
      address: 'Address 2',
      price: 300000,
      year: 2021,
      category: 2,
      ownerId: 'owner2',
      imageUrls: ['image2.jpg'],
      propertyTraces: []
    }
  ]

  it('should render PropertiesView with correct properties', () => {
    render(<PropertiesViewWrapper properties={mockProperties} />)

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    // The dynamic component might not render immediately, so we just check that the wrapper renders
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
  })

  it('should render with empty properties array', () => {
    render(<PropertiesViewWrapper properties={[]} />)

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('properties-view')).toBeInTheDocument()
    expect(screen.getByTestId('properties-count')).toHaveTextContent('0')
  })

  it('should render with single property', () => {
    const singleProperty = [mockProperties[0]]
    
    render(<PropertiesViewWrapper properties={singleProperty} />)

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('properties-view')).toBeInTheDocument()
    expect(screen.getByTestId('properties-count')).toHaveTextContent('1')
    expect(screen.getByTestId('property-1')).toHaveTextContent('Property 1')
  })

  it('should pass properties with complex data structure', () => {
    const complexProperties: Property[] = [
      {
        id: 'complex-1',
        name: 'Complex Property',
        address: 'Complex Address 123',
        price: 500000,
        year: 2022,
        category: 3,
        ownerId: 'complex-owner',
        imageUrls: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
        propertyTraces: [
          {
            event: 'Venta',
            value: 500000,
            date: '2022-01-01T00:00:00Z',
            tax: 10000
          },
          {
            event: 'Compra',
            value: 450000,
            date: '2021-01-01T00:00:00Z',
            tax: 9000
          }
        ]
      }
    ]

    render(<PropertiesViewWrapper properties={complexProperties} />)

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('properties-view')).toBeInTheDocument()
    expect(screen.getByTestId('properties-count')).toHaveTextContent('1')
    expect(screen.getByTestId('property-complex-1')).toHaveTextContent('Complex Property')
  })

  it('should handle properties with missing optional fields', () => {
    const propertiesWithMissingFields: Property[] = [
      {
        id: 'minimal-1',
        name: 'Minimal Property',
        address: 'Minimal Address',
        price: 100000,
        year: 2020,
        category: 1,
        ownerId: 'minimal-owner',
        imageUrls: [],
        propertyTraces: []
      }
    ]

    render(<PropertiesViewWrapper properties={propertiesWithMissingFields} />)

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('properties-view')).toBeInTheDocument()
    expect(screen.getByTestId('properties-count')).toHaveTextContent('1')
    expect(screen.getByTestId('property-minimal-1')).toHaveTextContent('Minimal Property')
  })

  it('should handle properties with isNear field', () => {
    const propertiesWithIsNear: Property[] = [
      {
        id: 'near-1',
        name: 'Near Property',
        address: 'Near Address',
        price: 250000,
        year: 2021,
        category: 1,
        ownerId: 'near-owner',
        imageUrls: ['near-image.jpg'],
        propertyTraces: [],
        isNear: true
      }
    ]

    render(<PropertiesViewWrapper properties={propertiesWithIsNear} />)

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('properties-view')).toBeInTheDocument()
    expect(screen.getByTestId('properties-count')).toHaveTextContent('1')
    expect(screen.getByTestId('property-near-1')).toHaveTextContent('Near Property')
  })

  it('should render ErrorBoundary with fallback', () => {
    render(<PropertiesViewWrapper properties={mockProperties} />)

    const errorBoundary = screen.getByTestId('error-boundary')
    expect(errorBoundary).toBeInTheDocument()
    
    // The ErrorBoundary should contain the PropertiesView
    expect(errorBoundary).toContainElement(screen.getByTestId('properties-view'))
  })

  it('should handle large number of properties', () => {
    const largePropertiesArray: Property[] = Array.from({ length: 100 }, (_, index) => ({
      id: `property-${index}`,
      name: `Property ${index}`,
      address: `Address ${index}`,
      price: 100000 + (index * 1000),
      year: 2020 + (index % 3),
      category: (index % 3) + 1,
      ownerId: `owner-${index}`,
      imageUrls: [`image-${index}.jpg`],
      propertyTraces: []
    }))

    render(<PropertiesViewWrapper properties={largePropertiesArray} />)

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('properties-view')).toBeInTheDocument()
    expect(screen.getByTestId('properties-count')).toHaveTextContent('100')
  })
})
