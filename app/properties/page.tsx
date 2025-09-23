import 'server-only'
import _ from "lodash";
import BPromise from 'bluebird';

import { GetPropertiesByFilters } from '../src/core/infraestructure/controllers/PropertiesController';
import PropertiesList from "./PropertiesView";
import { mapSearchParamsToProperties } from './mappers';
import { PROPERTY_CATEGORIES } from '../src/common/settings';
import Property from '../src/core/domain/Property';
import { uniqByWithPriority } from '../src/utils/arrays';

export const dynamicParams = true;
export const revalidate = 3600;

interface ISearchParams {
  [key: string]: string | undefined;
}
export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const searchParamsResolved = await searchParams;
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
      if (categoryNumber === 0) {
        return null
      }
      
      const result = await GetPropertiesByFilters.execute({
        ...filters,
        category: categoryNumber,
        page: 1,
        pageSize: 4,
      });
      return result;
    }, { concurrency: 3 });
    
    properties = uniqByWithPriority(allCategories.flat().filter((p) => !_.isNil(p)), 'name', 'isNear', true);
  }

  return (
    <div>
      <PropertiesList
        properties={properties}
      />
    </div>
  );
}