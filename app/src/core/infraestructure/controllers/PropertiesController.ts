import 'server-only'
import { IGetPropertiesProperties } from '../../application/interfaces/IPropertiesServices';
import Property from '../../domain/Property';
import PropertiesRepository from '../repositories/PropertiesRepository';
import GetProperties from '../../application/getProperties';
import { ApiError, NetworkError, ValidationError } from '../clients/InternalApiClient';

interface IGetPropertiesByFilters {
  execute(
    options: IGetPropertiesProperties
  ): Promise<Property[]>;
}

export const GetPropertiesByFilters: IGetPropertiesByFilters = {
  async execute(options) {
    try {
      // Validate input parameters
      if (!options || typeof options !== 'object') {
        throw new ValidationError('Opciones de búsqueda inválidas');
      }

      if (options.page && (options.page < 1 || !Number.isInteger(options.page))) {
        throw new ValidationError('El número de página debe ser un entero positivo');
      }

      if (options.pageSize && (options.pageSize < 1 || !Number.isInteger(options.pageSize))) {
        throw new ValidationError('El tamaño de página debe ser un entero positivo');
      }

      if (options.minPrice && options.maxPrice && options.minPrice > options.maxPrice) {
        throw new ValidationError('El precio mínimo no puede ser mayor al precio máximo');
      }

      const repository = new PropertiesRepository();
      const response = await GetProperties.execute(repository, options);

      if (!Array.isArray(response)) {
        console.warn('PropertiesController: Received non-array response', response);
        return [];
      }

      return response;
    } catch (error) {
      // Log the error with context
      console.error('PropertiesController: Error executing GetPropertiesByFilters', {
        options,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error)
      });

      // Re-throw custom errors
      if (error instanceof ApiError || error instanceof NetworkError || error instanceof ValidationError) {
        throw error;
      }

      // Handle unexpected errors
      throw new ApiError(
        'Error inesperado al obtener las propiedades',
        undefined,
        'UNEXPECTED_ERROR'
      );
    }
  },
};