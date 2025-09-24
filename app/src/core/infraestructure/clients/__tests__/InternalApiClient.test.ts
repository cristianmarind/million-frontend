import axios from 'axios'
import InternalApiClient, { ApiError, NetworkError, ValidationError } from '../InternalApiClient'

import { jest } from '@jest/globals'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock axios interceptors
const mockRequestInterceptor = jest.fn()
const mockResponseInterceptor = jest.fn()

mockedAxios.interceptors = {
  request: {
    use: mockRequestInterceptor
  },
  response: {
    use: mockResponseInterceptor
  }
} as any

// Mock the post method
const mockPost = jest.fn()
mockedAxios.post = mockPost as any

describe('InternalApiClient', () => {
  let client: InternalApiClient
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment variables
    process.env = {
      ...originalEnv,
      INTERNAL_API_URL: 'http://localhost:5119/api',
      APP_TOKEN: 'test-token'
    }

    // Clear all mocks
    jest.clearAllMocks()
    
    // Create new client instance
    client = new InternalApiClient()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('constructor', () => {
    it('should set up request interceptor with authorization header', () => {
      expect(mockRequestInterceptor).toHaveBeenCalled()
    })

    it('should set up response interceptor', () => {
      expect(mockResponseInterceptor).toHaveBeenCalled()
    })
  })

  describe('fetchData', () => {
    const mockEndpoint = 'test/endpoint'
    const mockData = { test: 'data' }

    it('should make successful API call', async () => {
      const mockResponse = {
        data: {
          success: true,
          value: { result: 'success' }
        }
      }

      mockPost.mockResolvedValueOnce(mockResponse as never)

      const result = await client.fetchData(mockEndpoint, mockData)

      expect(mockPost).toHaveBeenCalledWith(
        'http://localhost:5119/api/test/endpoint',
        mockData,
        { timeout: 30000 }
      )
      expect(result).toEqual({ result: 'success' })
    })

    it('should handle API error response', async () => {
      const mockResponse = {
        data: {
          success: false,
          error: 'API Error Message'
        }
      }

      mockPost.mockResolvedValueOnce(mockResponse as never)

      await expect(client.fetchData(mockEndpoint, mockData))
        .rejects
        .toThrow(ApiError)
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error')
      mockPost.mockRejectedValueOnce(networkError as never)

      await expect(client.fetchData(mockEndpoint, mockData))
        .rejects
        .toThrow(ApiError)
    })

    it('should handle HTTP errors', async () => {
      const httpError = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        },
        isAxiosError: true
      }

      mockPost.mockRejectedValueOnce(httpError as never)

      await expect(client.fetchData(mockEndpoint, mockData))
        .rejects
        .toThrow(ApiError)
    })

    it('should handle request without response', async () => {
      const requestError = {
        request: {},
        isAxiosError: true
      }

      mockPost.mockRejectedValueOnce(requestError as never)

      await expect(client.fetchData(mockEndpoint, mockData))
        .rejects
        .toThrow(ApiError)
    })

    it('should handle non-Axios errors', async () => {
      const genericError = new Error('Generic error')
      mockPost.mockRejectedValueOnce(genericError as never)

      await expect(client.fetchData(mockEndpoint, mockData))
        .rejects
        .toThrow(ApiError)
    })

    it('should handle completely unknown error types', async () => {
      const unknownError = 'string error'
      mockPost.mockRejectedValueOnce(unknownError as never)

      await expect(client.fetchData(mockEndpoint, mockData))
        .rejects
        .toThrow(ApiError)
    })
  })
})

describe('Custom Error Classes', () => {
  describe('ApiError', () => {
    it('should create ApiError with all properties', () => {
      const error = new ApiError('Test message', 404, 'NOT_FOUND', '/test')
      
      expect(error.message).toBe('Test message')
      expect(error.status).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
      expect(error.endpoint).toBe('/test')
      expect(error.name).toBe('ApiError')
    })

    it('should create ApiError with minimal properties', () => {
      const error = new ApiError('Test message')
      
      expect(error.message).toBe('Test message')
      expect(error.status).toBeUndefined()
      expect(error.code).toBeUndefined()
      expect(error.endpoint).toBeUndefined()
    })
  })

  describe('NetworkError', () => {
    it('should create NetworkError with default message', () => {
      const error = new NetworkError()
      
      expect(error.message).toBe('Error de conexión')
      expect(error.name).toBe('NetworkError')
    })

    it('should create NetworkError with custom message', () => {
      const error = new NetworkError('Custom network error')
      
      expect(error.message).toBe('Custom network error')
      expect(error.name).toBe('NetworkError')
    })
  })

  describe('ValidationError', () => {
    it('should create ValidationError with default message', () => {
      const error = new ValidationError()
      
      expect(error.message).toBe('Error de validación')
      expect(error.name).toBe('ValidationError')
    })

    it('should create ValidationError with custom message', () => {
      const error = new ValidationError('Custom validation error')
      
      expect(error.message).toBe('Custom validation error')
      expect(error.name).toBe('ValidationError')
    })
  })
})