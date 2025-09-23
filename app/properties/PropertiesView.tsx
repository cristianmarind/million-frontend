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
import PropertyFilterModal from "../src/components/properties/PropertyFilterModal";
import { DEFAULT_MAX_PRICE, FilterFormData, mapFormDataToQuery, mapQueryToFormData, PROPERTY_FILTER_CONTEXT, useFilters } from "../src/state/FiltersContext";
import EmptyListMessage from "../src/components/generals/EmptyListMessage";
import FilterValuesBadge from "../src/components/generals/FilterValuesBadge";

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


export default function PropertiesView({
  properties
}: {
  properties: Property[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false);
  const { filters, updateFiltersByContext, clearFilersByContext } = useFilters(PROPERTY_FILTER_CONTEXT);

  const [openFilters, setOpenFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  const enabledCategories = getEnabledCategories(properties);

  useEffect(() => {
    if (!isInitialized) {
      const urlFilters = mapQueryToFormData(Object.fromEntries(searchParams.entries()))
      updateFiltersByContext(PROPERTY_FILTER_CONTEXT, urlFilters)
      setIsInitialized(true)
    } else {
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

  }, [filters, currentFilters, isInitialized, searchParams])

  const goToPage = (p: number, params: any = {}) => {
    const queryParams = toQueryParams(params)
    router.push(`/properties?${queryParams}`);
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
      <div>
        <FilterValuesBadge context={PROPERTY_FILTER_CONTEXT} />
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
            rowHeight={400}
            overscanCount={2}
            rowProps={{}}
          />
        </div>
      </div>
      {
        openFilters && (
          <PropertyFilterModal show={openFilters} onClose={() => setOpenFilters(false)} />
        )
      }
    </div>
  );
}




