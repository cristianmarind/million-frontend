import 'server-only'
import { IGetPropertiesProperties } from '../../application/interfaces/IPropertiesServices';
import Property from '../../domain/Property';
import PropertiesRepository from '../repositories/PropertiesRepository';
import GetProperties from '../../application/getProperties';

interface IGetPropertiesByFilters {
  execute(
    options: IGetPropertiesProperties
  ): Promise<Property[]>;
}

export const GetPropertiesByFilters: IGetPropertiesByFilters = {
  async execute(options) {
    const repository = new PropertiesRepository();
    const reponse = await GetProperties.execute(repository, options)

    return reponse;
  },
};