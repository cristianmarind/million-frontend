import Property from "../../domain/Property";

export interface IGetPropertiesProperties {
    page: number;
    pageSize: number;
    minPrice?: number;
    maxPrice?: number;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    name?: string;
    longitude?: number;
    latitude?: number;
    category?: number;
}

export interface IRepositoryProperties {
    fetchByFilterAsync(options: IGetPropertiesProperties): Promise<Property[]>;
}

export interface IGetProperties {
  execute(
    repository: IRepositoryProperties,
    options: IGetPropertiesProperties
  ): Promise<Property[]>;
}