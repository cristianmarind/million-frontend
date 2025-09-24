import 'server-only'
import _ from 'lodash'
import axios, { AxiosError, AxiosResponse } from 'axios'

const API_URL = process.env.INTERNAL_API_URL;
const APP_TOKEN = process.env.APP_TOKEN;

interface ApiResponse<T> {
  data: T;
  status: string;
  error?: string;
  success?: boolean;
}

// Custom error classes for better error handling
export class ApiError extends Error {
  public status?: number;
  public code?: string;
  public endpoint?: string;

  constructor(message: string, status?: number, code?: string, endpoint?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.endpoint = endpoint;
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Error de conexión') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string = 'Error de validación') {
    super(message);
    this.name = 'ValidationError';
  }
}

export default class InternalApiClient {

  constructor() {
    axios.interceptors.request.use(
      (config) => {
        config.headers.Authorization = APP_TOKEN;
        return config;
      },
      (error) => {
        return Promise.reject(new NetworkError('Error al configurar la petición'));
      }
    );

    axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        // Ensure we have a valid error object before processing
        if (!error) {
          console.error('Response interceptor received null/undefined error');
          return Promise.reject(new ApiError('Error desconocido en la respuesta', undefined, 'NULL_ERROR'));
        }
        
        return Promise.reject(this.handleAxiosError(error));
      }
    );
  }

  private handleAxiosError(error: any): Error {
    console.error('Axios Error Details:', JSON.stringify(error, null, 2));
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);

    if (error?.code === 'ECONNABORTED') {
      return new NetworkError('Tiempo de espera agotado. Verifica tu conexión a internet.');
    }

    if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED') {
      return new NetworkError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    }

    if (error?.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      
      switch (status) {
        case 400:
          return new ValidationError(data?.message || 'Datos de entrada inválidos');
        case 401:
          return new ApiError('No autorizado. Verifica tus credenciales.', status, 'UNAUTHORIZED');
        case 403:
          return new ApiError('Acceso denegado.', status, 'FORBIDDEN');
        case 404:
          return new ApiError('Recurso no encontrado.', status, 'NOT_FOUND');
        case 422:
          return new ValidationError(data?.message || 'Error de validación en los datos enviados');
        case 500:
          return new ApiError('Error interno del servidor. Intenta más tarde.', status, 'INTERNAL_ERROR');
        case 502:
        case 503:
        case 504:
          return new ApiError('Servicio temporalmente no disponible. Intenta más tarde.', status, 'SERVICE_UNAVAILABLE');
        default:
          return new ApiError(
            data?.message || `Error del servidor (${status})`, 
            status, 
            'UNKNOWN_ERROR'
          );
      }
    }

    if (error?.request) {
      return new NetworkError('No se recibió respuesta del servidor. Verifica tu conexión a internet.');
    }

    if (error instanceof Error) {
      return new ApiError(error.message || 'Error desconocido de conexión', undefined, 'NON_AXIOS_ERROR');
    }

    return new ApiError('Error desconocido de conexión', undefined, 'UNKNOWN_ERROR_TYPE');
  }

  fetchData = async (endpoint: string, data: any = {}, config: any = {}) => {
    try {      
      const response = await axios.post(`${API_URL}/${endpoint}`, data, {
        timeout: 30000,
        ...config
      });

      const responseData: ApiResponse<any> = response.data;
      
      if (!_.get(responseData, 'success')) {      
        const errorMessage = responseData.error || 'Error en la respuesta del servidor';
        console.error('API Error Response:', {
          endpoint,
          error: errorMessage,
          data: _.get(responseData, 'data', responseData)
        });  
        throw new ApiError(errorMessage, response.status, 'API_ERROR', endpoint);
      }

      return _.get(response, 'data.value', null);
    } catch (error) {
      if (error instanceof ApiError || error instanceof NetworkError || error instanceof ValidationError) {
        throw error;
      }

      console.error('Unexpected API Error for endpoint:', endpoint);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Error type:', typeof error);
      
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Error desconocido al comunicarse con el servidor';
      
      throw new ApiError(
        errorMessage, 
        undefined, 
        'UNEXPECTED_ERROR', 
        endpoint
      );
    }
  }
}