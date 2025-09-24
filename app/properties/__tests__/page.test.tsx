import { render, screen } from '@testing-library/react'
import PropertiesPage from '../page'
import { GetPropertiesByFilters } from '../../src/core/infraestructure/controllers/PropertiesController'
import { ApiError, NetworkError, ValidationError } from '../../src/core/infraestructure/clients/InternalApiClient'

// Mock the dependencies
jest.mock('../../src/core/infraestructure/controllers/PropertiesController')
jest.mock('bluebird', () => ({
  map: jest.fn()
}))

const mockGetPropertiesByFilters = GetPropertiesByFilters as jest.Mocked<typeof GetPropertiesByFilters>
const mockBPromise = require('bluebird')

describe('PropertiesPage', () => {
  const mockSearchParams = {
    name: 'Test Property',
    address: 'Test Address',
    minPrice: '100000',
    maxPrice: '500000',
    category: '1'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render properties successfully with valid category', async () => {
    const mockProperties = [
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
      }
    ]

    mockGetPropertiesByFilters.execute.mockResolvedValueOnce(mockProperties)

    const component = await PropertiesPage({
      searchParams: Promise.resolve(mockSearchParams)
    })

    render(component)

    expect(mockGetPropertiesByFilters.execute).toHaveBeenCalledWith({
      name: 'Test Property',
      address: 'Test Address',
      minPrice: 100000,
      maxPrice: 500000,
      category: 1,
      page: 1,
      pageSize: 5,
      country: undefined,
      state: undefined,
      city: undefined,
      longitude: undefined,
      latitude: undefined
    })
  })

  it('should render properties successfully without category (all categories)', async () => {
    const mockProperties = [
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
      }
    ]

    // Mock BPromise.map to return properties for each category
    mockBPromise.map.mockResolvedValueOnce([
      mockProperties, // category 1
      mockProperties, // category 2
      mockProperties  // category 3
    ])

    const searchParamsWithoutCategory = {
      name: 'Test Property',
      address: 'Test Address'
    }

    const component = await PropertiesPage({
      searchParams: Promise.resolve(searchParamsWithoutCategory)
    })

    render(component)

    expect(mockBPromise.map).toHaveBeenCalled()
  })

  it('should handle invalid category gracefully', async () => {
    const mockProperties = [
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
      }
    ]

    // Mock BPromise.map to return properties for each category
    mockBPromise.map.mockResolvedValueOnce([
      mockProperties, // category 1
      mockProperties, // category 2
      mockProperties  // category 3
    ])

    const searchParamsWithInvalidCategory = {
      name: 'Test Property',
      category: '999' // Invalid category
    }

    const component = await PropertiesPage({
      searchParams: Promise.resolve(searchParamsWithInvalidCategory)
    })

    render(component)

    expect(mockBPromise.map).toHaveBeenCalled()
  })

  it('should handle API errors gracefully', async () => {
    const apiError = new ApiError('API Error', 500, 'INTERNAL_ERROR')
    mockGetPropertiesByFilters.execute.mockRejectedValueOnce(apiError)

    const component = await PropertiesPage({
      searchParams: Promise.resolve(mockSearchParams)
    })

    render(component)

    expect(screen.getByText('Error al cargar las propiedades')).toBeInTheDocument()
    expect(screen.getByText('Ha ocurrido un error inesperado. Por favor, intenta nuevamente.')).toBeInTheDocument()
    expect(screen.getByText('Reintentar')).toBeInTheDocument()
  })

  it('should handle network errors gracefully', async () => {
    const networkError = new NetworkError('Network Error')
    mockGetPropertiesByFilters.execute.mockRejectedValueOnce(networkError)

    const component = await PropertiesPage({
      searchParams: Promise.resolve(mockSearchParams)
    })

    render(component)

    expect(screen.getByText('Error al cargar las propiedades')).toBeInTheDocument()
    expect(screen.getByText('Ha ocurrido un error inesperado. Por favor, intenta nuevamente.')).toBeInTheDocument()
    expect(screen.getByText('Reintentar')).toBeInTheDocument()
  })

  it('should handle validation errors gracefully', async () => {
    const validationError = new ValidationError('Validation Error')
    mockGetPropertiesByFilters.execute.mockRejectedValueOnce(validationError)

    const component = await PropertiesPage({
      searchParams: Promise.resolve(mockSearchParams)
    })

    render(component)

    expect(screen.getByText('Error al cargar las propiedades')).toBeInTheDocument()
    expect(screen.getByText('Ha ocurrido un error inesperado. Por favor, intenta nuevamente.')).toBeInTheDocument()
    expect(screen.getByText('Reintentar')).toBeInTheDocument()
  })

  it('should handle unexpected errors gracefully', async () => {
    const unexpectedError = new Error('Unexpected Error')
    mockGetPropertiesByFilters.execute.mockRejectedValueOnce(unexpectedError)

    const component = await PropertiesPage({
      searchParams: Promise.resolve(mockSearchParams)
    })

    render(component)

    expect(screen.getByText('Error al cargar las propiedades')).toBeInTheDocument()
    expect(screen.getByText('Ha ocurrido un error inesperado. Por favor, intenta nuevamente.')).toBeInTheDocument()
    expect(screen.getByText('Reintentar')).toBeInTheDocument()
  })

  it('should handle category errors gracefully in BPromise.map', async () => {
    const mockProperties = [
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
      }
    ]

    // Mock BPromise.map to return some successful results and some errors
    mockBPromise.map.mockResolvedValueOnce([
      mockProperties, // category 1 - success
      [], // category 2 - error (empty array returned)
      mockProperties  // category 3 - success
    ])

    const searchParamsWithoutCategory = {
      name: 'Test Property'
    }

    const component = await PropertiesPage({
      searchParams: Promise.resolve(searchParamsWithoutCategory)
    })

    render(component)

    expect(mockBPromise.map).toHaveBeenCalled()
  })

  it('should handle empty search params', async () => {
    const mockProperties = [
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
      }
    ]

    // Mock BPromise.map to return properties for each category
    mockBPromise.map.mockResolvedValueOnce([
      mockProperties, // category 1
      mockProperties, // category 2
      mockProperties  // category 3
    ])

    const component = await PropertiesPage({
      searchParams: Promise.resolve({})
    })

    render(component)

    expect(mockBPromise.map).toHaveBeenCalled()
  })

  it('should handle search params with only some fields', async () => {
    const mockProperties = [
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
      }
    ]

    mockGetPropertiesByFilters.execute.mockResolvedValueOnce(mockProperties)

    const partialSearchParams = {
      name: 'Test Property'
    }

    const component = await PropertiesPage({
      searchParams: Promise.resolve(partialSearchParams)
    })

    render(component)

    expect(mockBPromise.map).toHaveBeenCalled()
  })

  it('should handle numeric search params correctly', async () => {
    const mockProperties = [
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
      }
    ]

    mockGetPropertiesByFilters.execute.mockResolvedValueOnce(mockProperties)

    const numericSearchParams = {
      minPrice: '100000',
      maxPrice: '500000',
      category: '2'
    }

    const component = await PropertiesPage({
      searchParams: Promise.resolve(numericSearchParams)
    })

    render(component)

    expect(mockGetPropertiesByFilters.execute).toHaveBeenCalledWith({
      minPrice: 100000,
      maxPrice: 500000,
      category: 2,
      page: 1,
      pageSize: 5,
      name: undefined,
      address: undefined,
      country: undefined,
      state: undefined,
      city: undefined,
      longitude: undefined,
      latitude: undefined
    })
  })
})
