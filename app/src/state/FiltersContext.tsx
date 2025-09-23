"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode
} from 'react';
import _ from 'lodash';

const LOCAL_STORAGE_KEY = 'persistedFilters';

export interface FilterItem {
  key: string;
  value: any;
  context: string;
  persist?: boolean;
  defaultValue?: any;
}

export interface FiltersContextType {
  filters: FilterItem[];
  updateFiltersByContext: (context: string, updates: Record<string, any>, omitVoidValues?: boolean) => any;
  clearFilersByContext: (context: string) => void;
  clearFilerItemByContext: (context: string, key: string) => void;
}

interface IdsFilterItem {
  key: string;
  context: string;
}

export interface FilterFormData {
  propertyName?: string;
  propertyAddress?: string;
  propertyPrice?: [number, number]; // [minPrice, maxPrice]
}

interface QueryParams {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type FilterFormDataStrings = {
  [K in keyof FilterFormData]: string;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const PROPERTY_FILTER_CONTEXT = "propertiesFilter"
export const DEFAULT_MIN_PRICE = 0;
export const DEFAULT_MAX_PRICE = 10000000;
export const LABEL_BY_KEY: FilterFormDataStrings = {
  propertyName: 'Nombre',
  propertyAddress: 'Dirección/Ubicación',
  propertyPrice: 'Precio'
}
export const DEFAULT_FILTER_ITEMS: FilterItem[] = [
  {
    key: 'propertyName',
    value: "",
    context: PROPERTY_FILTER_CONTEXT,
    persist: true,
    defaultValue: ""
  },
  {
    key: 'propertyAddress',
    value: "",
    context: PROPERTY_FILTER_CONTEXT,
    persist: true,
    defaultValue: ""
  },
  {
    key: 'propertyPrice',
    value: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    context: PROPERTY_FILTER_CONTEXT,
    persist: true,
    defaultValue: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]
  }
]

export const getFiltersValuesFilters = (filters: FilterItem[], omitVoidValues = false) => {
  return filters.reduce((acc, item) => {
    if (omitVoidValues && (_.isNil(item.value) || item.value === "")) {
      return acc;
    }
    acc[item.key] = item.value;
    return acc;
  }, {} as { [key: string]: any });
};

export const areFilterItemsSame = (a: FilterItem | IdsFilterItem, b: FilterItem | IdsFilterItem): boolean => {
  return a.context === b.context && a.key === b.key;
}

export const mergeFilters = (priorityFilters: FilterItem[], secondaryFilters: FilterItem[]): FilterItem[] => {
  const getCompositeKey = (item: FilterItem) => `${item.key}:${item.context}`;

  const secondaryIndexed = _.keyBy(secondaryFilters, getCompositeKey);
  const priorityIndexed = _.keyBy(priorityFilters, getCompositeKey);

  const mergedObj = _.merge(secondaryIndexed, priorityIndexed);

  return _.values(mergedObj);
}

export function mapFormDataToQuery(formData: FilterFormData): QueryParams {
  const query: QueryParams = {
    name: formData.propertyName,
    address: formData.propertyAddress
  }
  const minPrice = _.defaultTo(_.get(formData.propertyPrice, '0'), undefined)
  const maxPrice = _.defaultTo(_.get(formData.propertyPrice, '1'), undefined)

  if (_.isNumber(minPrice) && minPrice && minPrice !== DEFAULT_MIN_PRICE) {
    query.minPrice = minPrice
  }
  if (_.isNumber(maxPrice) && maxPrice && maxPrice !== DEFAULT_MAX_PRICE) {
    query.maxPrice = maxPrice
  }

  return query
}

export function mapQueryToFormData(query: QueryParams): FilterFormData {
  let propertyPrice: [number, number] | undefined = undefined;
  if (typeof query.minPrice === "number" && typeof query.maxPrice === "number") {
    propertyPrice = [query.minPrice, query.maxPrice];
  }

  return {
    propertyName: query.name,
    propertyAddress: query.address,
    ...(propertyPrice !== undefined ? { propertyPrice } : {}),
  };
}

const getStoredFilterValues = (filters: FilterItem[]): FilterItem[] => {
  const storedFilters = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedFilters) {
    const result = mergeFilters(JSON.parse(storedFilters), filters)      
    return result
  }
  return filters
}

const DEFAULT_FILTER_ITEMS_STORED = getStoredFilterValues(DEFAULT_FILTER_ITEMS);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterItem[]>(DEFAULT_FILTER_ITEMS_STORED);

  const updateFiltersByContext = (
    context: string,
    updates: Record<string, any>,
    omitVoidValues = true
  ) => {
    let newFilters: typeof filters = [];

    setFilters((prev) => {
      newFilters = prev.map((f) => {
        if (f.context !== context) return f;

        // Si el filtro actual está en updates, actualiza su valor
        if (updates.hasOwnProperty(f.key)) {
          return { ...f, value: updates[f.key] };
        }

        return f;
      });

      return newFilters;
    });
    const persisted = newFilters.filter((f) => f.persist);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persisted));

    const filteredItems = newFilters.filter((f) => f.context === context);
    return getFiltersValuesFilters(filteredItems, omitVoidValues);
  };

  const clearFilersByContext = (context: string) => {
    let newFilters: typeof filters = [];

    setFilters((prev) => {
      newFilters = prev.map((f) => {
        if (f.context === context) return { ...f, value: f.defaultValue || "" };

        return f;
      });

      return newFilters;
    });
    const persisted = newFilters.filter((f) => f.persist);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persisted));
  }

const clearFilerItemByContext = (context: string, key: string) => {
    let newFilters: typeof filters = [];

    setFilters((prev) => {
      newFilters = prev.map((f) => {
        if (areFilterItemsSame(f, { context, key })) return { ...f, value: f.defaultValue || "" };

        return f;
      });

      return newFilters;
    });
    const persisted = newFilters.filter((f) => f.persist);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persisted));
  }
  return (
    <FiltersContext.Provider
      value={{
        filters,
        updateFiltersByContext,
        clearFilersByContext,
        clearFilerItemByContext
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = (filterContext: string) => {
  const context = useContext(FiltersContext);

  if (!context) throw new Error('useFilters must be used within FilterProvider');

  const storedFilters = getStoredFilterValues(context.filters);
  const defaultFilterValue = getFiltersValuesFilters(_.filter(storedFilters, { context: filterContext }));

  return { ...context, defaultFilterValue };
};