import 'server-only'
import { headers } from "next/headers";
import _ from "lodash";
import BPromise from 'bluebird';

import { GetPropertiesByFilters } from '../src/core/infraestructure/controllers/PropertiesController';
import PropertiesList from "./PropertiesList";
import { getLocationFromIP, getUserIP } from '../src/utils/location';
import { mapSearchParamsToProperties } from './mappers';
import { PROPERTY_CATEGORIES } from '../src/common/settings';
import Property from '../src/core/domain/Property';
import { uniqByWithPriority } from '../src/utils/arrays';

interface ISearchParams {
  [key: string]: string | undefined;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const [
    searchParamsResolved,
    headersList
  ] = await Promise.all([searchParams, headers()]);

  const ip = await getUserIP(headersList);
  const { longitude, latitude } = await getLocationFromIP(ip);
  
  const filters = mapSearchParamsToProperties(searchParamsResolved);
  let properties: Property[] = []

  // Si se proporciona una categoría válida, filtrar normalmente
  if (filters.category && PROPERTY_CATEGORIES[filters.category]) {
    properties = await GetPropertiesByFilters.execute(filters)
  } else {
    // Si no se proporciona una categoría o es inválida, 
    // hace múltiples llamadas para cada categoría a la vez
    const allCategories = await BPromise.map(Object.keys(PROPERTY_CATEGORIES), async (categoryKey: string) => {
      const categoryNumber = Number(categoryKey);
      if (categoryNumber === 0 && longitude && latitude) {
        const nearResult = await GetPropertiesByFilters.execute({
          ..._.omit(filters, 'category'),
          longitude,
          latitude,
          page: 1,
          pageSize: 2,
        });

        return nearResult.map((item: Property) => ({ ...item, isNear: true }));
      }
      
      const result = await GetPropertiesByFilters.execute({
        ...filters,
        category: categoryNumber,
        page: 1,
        pageSize: 4,
      });
      return result;
    }, { concurrency: 3 });

    properties = uniqByWithPriority(allCategories.flat(), 'name', 'isNear', true);
  }




  return (
    <div>
      <PropertiesList
        properties={properties}
        total={100} // Simulando un total fijo
        page={filters.page}
        pageSize={filters.pageSize}
      />
    </div>
  );
}