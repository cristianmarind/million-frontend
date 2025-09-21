"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { List, RowComponentProps } from 'react-window';
import _ from 'lodash';
import { SlidersHorizontal } from 'lucide-react';

import Property from "../src/core/domain/Property";
import PropertyHeroCard from "../src/components/properties/PropertyHeroCard";
import PropertyCategory from "../src/components/properties/PropertyCategory";
import { getEnabledCategories } from "../src/utils/propertiesRender";
import { Button } from "react-bootstrap";
import PropertyFilterModal, { FilterFormData } from "../src/components/properties/PropertyFilterModal";
import { DEFAULT_MAX_PRICE, mapFormDataToQuery, mapQueryToFormData, PROPERTY_FILTER_CONTEXT, useFilters } from "../src/state/FiltersContext";
import EmptyListMessage from "../src/components/generals/EmptyListMessage";

function toQueryParams(obj: Record<string, any>) {
  let availibleFilters: any = {}
  if (obj.minPrice === 0) {
    availibleFilters = _.omit(obj, 'minPrice');
  }
  if (obj.maxPrice === DEFAULT_MAX_PRICE) {
    availibleFilters = _.omit(obj, 'maxPrice');
  }
  return new URLSearchParams(
    _.omitBy(obj, (v) => (
      _.isNil(v) || (_.isString(v) && _.trim(v) === "")
    ))).toString();
}


export default function PropertiesList({
  properties,
  total,
  page,
  pageSize,
}: {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false);
  const { filters, updateFiltersByContext, clearFilersByContext } = useFilters(PROPERTY_FILTER_CONTEXT);

  const [openFilters, setOpenFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  const totalPages = Math.ceil(total / pageSize);
  const enabledCategories = getEnabledCategories(properties);

  useEffect(() => {
    if (!isInitialized) {
      const urlFilters = mapQueryToFormData(Object.fromEntries(searchParams.entries()))
      console.log({urlFilters });
      updateFiltersByContext(PROPERTY_FILTER_CONTEXT, urlFilters)
      setIsInitialized(true)
    }
  }, [isInitialized, searchParams])

  useEffect(() => {
     if(isInitialized) {
      const contextFilter = _.filter(filters, { context: PROPERTY_FILTER_CONTEXT });
      const newCurrentFilter: Partial<FilterFormData> = contextFilter.reduce((accum, item) => ({
        ...accum,
        [item.key]: item.value,
      }), {});
      if (!_.isEqual(currentFilters, newCurrentFilter)) {
        setCurrentFilters(newCurrentFilter);
        const query = mapFormDataToQuery(newCurrentFilter)
        goToPage(0, query)
      }
    }

  }, [filters, currentFilters, isInitialized])

  const goToPage = (p: number, params: any = {}) => {
    const queryParams = toQueryParams(params)
    router.push(`/properties?page=${p}&pageSize=${pageSize}&${queryParams}`);
  };

  const Row = ({ index, style }: RowComponentProps) => (
    <div style={style}>
      <PropertyCategory properties={properties} category={enabledCategories[index]} />
    </div>
  );

  if (!properties.length) {
    return <EmptyListMessage onClearFilter={() => clearFilersByContext(PROPERTY_FILTER_CONTEXT)} />
  }

  return (
    <div>
      <div className="d-flex flex-column w-100 mb-4">
        {properties.length > 0 && (
          <PropertyHeroCard property={properties[0]} />
        )}
      </div>
      <div className="px-5">

        <div>BADGES</div>
      </div>
      <div>
        <div className="btn-properties-filter">
          <Button variant="light" onClick={() => setOpenFilters(!openFilters)}>
            <SlidersHorizontal style={{ width: '20px', height: '20px' }} />
            {
              " "
            }
            <span>Filtros</span>
          </Button>
        </div>
        <div className="mt-4 px-5">
          <List
            rowComponent={Row}
            rowCount={enabledCategories.length}
            rowHeight={350}
            overscanCount={2}
            rowProps={{}}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="btn btn-outline-secondary px-3 py-1"
        >
          Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="btn btn-outline-secondary px-3 py-1"
        >
          Siguiente
        </button>
      </div>
      {
        openFilters && (
          <PropertyFilterModal show={openFilters} onClose={() => setOpenFilters(false)} />
        )
      }
    </div>
  );
}




