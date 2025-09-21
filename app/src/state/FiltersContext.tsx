"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import _ from 'lodash';

const LOCAL_STORAGE_KEY = 'persistedFilters';

export interface FilterItem {
  key: string;
  value: any;
  context: string;
  persist?: boolean;
}

export interface FiltersContextType {
  filters: FilterItem[];
  updateFiltersByContext: (context: string, updates: Record<string, any>, omitVoidValues?: boolean) => any;
}

interface IdsFilterItem {
  key: string;
  context: string;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const PROPERTY_FILTER_CONTEXT = "propertiesFilter"
export const DEFAULT_MIN_PRICE = 0;
export const DEFAULT_MAX_PRICE = 10000000;
export const DEFAULT_FILTER_ITEMS = [
  {
    key: 'propertyName',
    value: "",
    context: PROPERTY_FILTER_CONTEXT,
    persist: true,
  },
  {
    key: 'propertyAddress',
    value: "",
    context: PROPERTY_FILTER_CONTEXT,
    persist: true,
  },
  {
    key: 'propertyPrice',
    value: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    context: PROPERTY_FILTER_CONTEXT,
    persist: true,
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

const getStoredFilterValues = (filters: FilterItem[]): FilterItem[] => {
  const storedFilters = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedFilters) {
    const result = mergeFilters(JSON.parse(storedFilters), filters)      
    return result
  }
  return filters
}

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterItem[]>(DEFAULT_FILTER_ITEMS);

  useEffect(() => {
    const storedFilters = getStoredFilterValues(filters);

    if (storedFilters) {
      setFilters(storedFilters);
    }
  }, []);

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

  return (
    <FiltersContext.Provider
      value={{
        filters,
        updateFiltersByContext
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