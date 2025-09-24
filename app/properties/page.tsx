import 'server-only'
import _ from "lodash";
import BPromise from 'bluebird';

import { GetPropertiesByFilters } from '../src/core/infraestructure/controllers/PropertiesController';
import PropertiesViewWrapper from "./PropertiesViewWrapper";
import { mapSearchParamsToProperties } from './mappers';
import { PROPERTY_CATEGORIES } from '../src/common/settings';
import Property from '../src/core/domain/Property';
import { uniqByWithPriority } from '../src/utils/arrays';
import { ApiError, NetworkError, ValidationError } from '../src/core/infraestructure/clients/InternalApiClient';
import { PropertiesErrorMessage } from '../src/components/generals/ErrorMessage';

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
  try {
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
        
        try {
          const result = await GetPropertiesByFilters.execute({
            ...filters,
            category: categoryNumber,
            page: 1,
            pageSize: 4,
          });
          return result;
        } catch (error) {
          console.error(`Error fetching properties for category ${categoryNumber}:`, error);
          return [];
        }
      }, { concurrency: 3 });
      
      properties = uniqByWithPriority(allCategories.flat().filter((p) => !_.isNil(p)), 'name', 'isNear', true);
    }

    return (
      <div>
        <PropertiesViewWrapper
          properties={properties}
        />
      </div>
    );
  } catch (error) {
    console.error('PropertiesPage: Error loading properties page', error);
    
    return (
      <PropertiesErrorMessage
        error={new Error("Error loading properties page")}
        onRetry={() => window.location.reload()}
      />
    );
  }
}