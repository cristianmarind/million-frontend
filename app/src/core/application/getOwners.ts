import 'server-only'
import { IGetOwners } from './interfaces/IOwnersServices';

const GetOwners: IGetOwners = {
  async execute(repository, options) {
    // Buscar la data de los owners
    return repository.fetchByFilterAsync(options);
  },
};

export default GetOwners;