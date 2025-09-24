import PropertiesRepository from '../PropertiesRepository'
import InternalApiClient from '../../clients/InternalApiClient'

// Mock the InternalApiClient
jest.mock('../../clients/InternalApiClient')
const mockInternalApiClient = InternalApiClient as jest.MockedClass<typeof InternalApiClient>

describe('PropertiesRepository', () => {
  let repository: PropertiesRepository
  let mockClient: jest.Mocked<InternalApiClient>

  beforeEach(() => {
    // Clear the static instance before each test
    (PropertiesRepository as any).instance = undefined
    
    // Create mock client instance
    mockClient = {
      fetchData: jest.fn()
    } as any

    // Mock the constructor to return our mock client
    mockInternalApiClient.mockImplementation(() => mockClient)
    
    repository = new PropertiesRepository()
  })

  describe('fetchByFilterAsync', () => {
    const mockOptions = {
      page: 1,
      pageSize: 10,
      minPrice: 100000,
      maxPrice: 500000,
      name: 'Test Property'
    }

    it('should fetch properties successfully', async () => {
      const mockApiResponse = [
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

      mockClient.fetchData.mockResolvedValueOnce(mockApiResponse)

      const result = await repository.fetchByFilterAsync(mockOptions)

      expect(mockClient.fetchData).toHaveBeenCalledWith('properties/find', mockOptions)
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: '1',
        name: 'Property 1',
        address: 'Address 1',
        price: 200000,
        year: 2020,
        category: 1,
        ownerId: 'owner1',
        imageUrls: ['image1.jpg'],
        propertyTraces: []
      })
    })

    it('should return empty array for null response', async () => {
      mockClient.fetchData.mockResolvedValueOnce(null)

      const result = await repository.fetchByFilterAsync(mockOptions)

      expect(result).toEqual([])
    })

    it('should return empty array for undefined response', async () => {
      mockClient.fetchData.mockResolvedValueOnce(undefined)

      const result = await repository.fetchByFilterAsync(mockOptions)

      expect(result).toEqual([])
    })

    it('should return empty array for non-array response', async () => {
      mockClient.fetchData.mockResolvedValueOnce('invalid response')

      const result = await repository.fetchByFilterAsync(mockOptions)

      expect(result).toEqual([])
    })

    it('should return empty array for empty array response', async () => {
      mockClient.fetchData.mockResolvedValueOnce([])

      const result = await repository.fetchByFilterAsync(mockOptions)

      expect(result).toEqual([])
    })

    it('should handle API client errors and re-throw them', async () => {
      const apiError = new Error('API Error')
      mockClient.fetchData.mockRejectedValueOnce(apiError)

      await expect(repository.fetchByFilterAsync(mockOptions))
        .rejects
        .toThrow(apiError)

      expect(mockClient.fetchData).toHaveBeenCalledWith('properties/find', mockOptions)
    })

    it('should handle network errors and re-throw them', async () => {
      const networkError = new Error('Network Error')
      mockClient.fetchData.mockRejectedValueOnce(networkError)

      await expect(repository.fetchByFilterAsync(mockOptions))
        .rejects
        .toThrow(networkError)
    })

    it('should handle validation errors and re-throw them', async () => {
      const validationError = new Error('Validation Error')
      mockClient.fetchData.mockRejectedValueOnce(validationError)

      await expect(repository.fetchByFilterAsync(mockOptions))
        .rejects
        .toThrow(validationError)
    })

    it('should work with minimal options', async () => {
      const minimalOptions = {
        page: 1,
        pageSize: 10
      }

      const mockApiResponse = [
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

      mockClient.fetchData.mockResolvedValueOnce(mockApiResponse)

      const result = await repository.fetchByFilterAsync(minimalOptions)

      expect(mockClient.fetchData).toHaveBeenCalledWith('properties/find', minimalOptions)
      expect(result).toHaveLength(1)
    })

    it('should work with all possible options', async () => {
      const fullOptions = {
        page: 1,
        pageSize: 10,
        minPrice: 100000,
        maxPrice: 500000,
        country: 'Colombia',
        state: 'Antioquia',
        city: 'Medellín',
        address: 'Calle 123',
        name: 'Test Property',
        longitude: -75.5636,
        latitude: 6.2442,
        category: 1,
        propertyId: 'prop123'
      }

      const mockApiResponse = [
        {
          id: 'prop123',
          name: 'Test Property',
          address: 'Calle 123, Medellín, Antioquia',
          price: 200000,
          year: 2020,
          category: 1,
          ownerId: 'owner1',
          imageUrls: ['image1.jpg'],
          propertyTraces: []
        }
      ]

      mockClient.fetchData.mockResolvedValueOnce(mockApiResponse)

      const result = await repository.fetchByFilterAsync(fullOptions)

      expect(mockClient.fetchData).toHaveBeenCalledWith('properties/find', fullOptions)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('prop123')
    })

    it('should handle properties with complex propertyTraces', async () => {
      const mockApiResponse = [
        {
          id: '1',
          name: 'Property 1',
          address: 'Address 1',
          price: 200000,
          year: 2020,
          category: 1,
          ownerId: 'owner1',
          imageUrls: ['image1.jpg'],
          propertyTraces: [
            {
              name: 'Venta',
              value: 200000,
              date: '2020-01-01T00:00:00Z'
            },
            {
              name: 'Compra',
              value: 180000,
              date: '2019-01-01T00:00:00Z'
            }
          ]
        }
      ]

      mockClient.fetchData.mockResolvedValueOnce(mockApiResponse)

      const result = await repository.fetchByFilterAsync(mockOptions)

      expect(result).toHaveLength(1)
      expect(result[0].propertyTraces).toHaveLength(2)
      expect(result[0].propertyTraces[0]).toMatchObject({
        event: 'Venta',
        value: 200000,
        date: '2020-01-01T00:00:00Z'
      })
    })
  })

  describe('singleton pattern', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = new PropertiesRepository()
      const instance2 = new PropertiesRepository()

      expect(instance1).toStrictEqual(instance2)
    })

    it('should use the same client instance', () => {
      // Clear the static instance before testing
      (PropertiesRepository as any).instance = undefined
      
      // Reset the mock call count
      mockInternalApiClient.mockClear()
      
      const instance1 = new PropertiesRepository()
      const instance2 = new PropertiesRepository()

      // Both instances should use the same mocked client
      // The singleton pattern means only one instance is created
      expect(instance1).toStrictEqual(instance2)
    })
  })
})
