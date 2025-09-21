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
  addFilter: (filter: FilterItem) => void;
  addFilters: (filter: FilterItem[]) => void;
  updateFilter: (key: string, context:string, value: any) => void;
  removeFilter: (key: string, context: string) => void;
  clearFilters: () => void;
  getFilterItemValue: (key: string, context: string) => any | undefined;
  getFiltersValuesByContext: (context: string) => any | undefined;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const getFiltersValuesFilters = (filters: FilterItem[], omitVoidValues = false) => {
  return filters.reduce((acc, item) => {
    if (omitVoidValues && (_.isNil(item.value) || item.value === "")) {
      return acc;
    }
    acc[item.key] = item.value;
    return acc;
  }, {} as { [key: string]: any });
};

interface IdsFilterItem {
  key: string;
  context: string;
}
export const areFilterItemsSame = (a: FilterItem | IdsFilterItem, b: FilterItem | IdsFilterItem):boolean => {
  return a.context === b.context && a.key === b.key;
}

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterItem[]>([]);

  // Load persisted filters from localStorage on mount
  useEffect(() => {
    const storedFilters = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedFilters) {
      setFilters(JSON.parse(storedFilters));
    }
  }, []);

  // Save persisted filters to localStorage on change
  useEffect(() => {
    const persisted = filters.filter((f) => f.persist);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persisted));
  }, [filters]);

  const addFilter = (newFilter: FilterItem) => {
    setFilters((prev) => {
      if (prev.some((f) => areFilterItemsSame(f, newFilter))) {
        return prev;
      }
      return [...prev, newFilter];
    });
  };

  const addFilters = (filtersToAdd: FilterItem[]) => {
    setFilters((prev) => {
      const existingIds = new Set(prev.map((f) => f.key + '&' + f.context));
      const newFilters = filtersToAdd.filter((f) => !existingIds.has(f.key + '&' + f.context));
      return [...prev, ...newFilters];
    });
  };

  const updateFilter = (key: string, context: string, value: any) => {
    setFilters((prev) =>
      prev.map((f) => (areFilterItemsSame(f, { context, key}) ? { ...f, value } : f))
    );
  };

  const removeFilter = (key: string, context: string) => {
    setFilters((prev) => prev.filter((f) => areFilterItemsSame(f, { context, key})));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const getFilterItemValue = (key: string, context: string) => {
    const filter = filters.find((f) => areFilterItemsSame(f, { context, key}));
    return !_.isNil(filter) ? filter.value : undefined;
  };

  const getFiltersValuesByContext = (context: string, omitVoidValues = true) => {
    const filteredItems = filters.filter((f) => f.context === context);
    return getFiltersValuesFilters(filteredItems, omitVoidValues);
  };

  return (
    <FiltersContext.Provider
      value={{
        filters,
        addFilter,
        addFilters,
        updateFilter,
        removeFilter,
        clearFilters,
        getFilterItemValue,
        getFiltersValuesByContext
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = (defaultFilters: FilterItem[], forceDefaultValues = false) => {
  const context = useContext(FiltersContext);
  if (!context) throw new Error('useFilters must be used within FilterProvider');

  const { filters, addFilter } = context;

  useEffect(() => {
    defaultFilters.forEach((filter) => {
      const filterExists = filters.some((f) => f.key === filter.key && f.context === filter.context);
      if (forceDefaultValues || !filterExists) {
        addFilter(filter);
      }
    });
  }, []);

  return context;
};