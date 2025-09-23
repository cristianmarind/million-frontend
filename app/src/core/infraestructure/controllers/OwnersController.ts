import 'server-only'
import Owner from '../../domain/Owner';
import { IGetOwnersProperties } from '../../application/interfaces/IOwnersServices';
import OwnersRepository from '../repositories/OwnersRepository';
import GetOwners from '../../application/getOwners';

interface IGetOwnersByFilters {
  execute(
    options: IGetOwnersProperties
  ): Promise<Owner[]>;
}

export const GetOwnersByFilters: IGetOwnersByFilters = {
  async execute(options) {
    const repository = new OwnersRepository();
    const reponse = await GetOwners.execute(repository, options)

    return reponse;
  },
};