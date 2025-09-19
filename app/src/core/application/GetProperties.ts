import 'server-only'
import { IGetProperties } from "./interfaces/IPropertiesServices";

const GetProperties: IGetProperties = {
  async execute(repository, options) {
    // Buscar la data de los owners
    return repository.fetchByFilterAsync(options);
  },
};

export default GetProperties;