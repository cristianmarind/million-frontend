import { IGetPropertiesProperties } from "../src/core/application/interfaces/IPropertiesServices";

// Mapper: convierte los searchParams en el tipo correcto
export function mapSearchParamsToProperties(
  params: Partial<Record<string, string | number>>
): IGetPropertiesProperties {
  const {
    page,
    pageSize,
    minPrice,
    maxPrice,
    country,
    state,
    city,
    address,
    name,
    longitude,
    latitude,
    category,
  } = params;

  return {
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 5,
    minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
    country: country ? String(country) : undefined,
    state: state ? String(state) : undefined,
    city: city ? String(city) : undefined,
    address: address ? String(address) : undefined,
    name: name ? String(name) : undefined,
    longitude: longitude !== undefined ? Number(longitude) : undefined,
    latitude: latitude !== undefined ? Number(latitude) : undefined,
    category: category !== undefined ? Number(category) : undefined,
  };
}
