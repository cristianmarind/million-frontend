"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { List, RowComponentProps } from 'react-window';
import _ from 'lodash';
import { SlidersHorizontal } from 'lucide-react';

import Property from "../src/core/domain/Property";
import PropertyHeroCard from "../src/components/properties/PropertyHeroCard";
import PropertyCategory from "../src/components/properties/PropertyCategory";
import { getEnabledCategories } from "../src/utils/propertiesRender";
import { Button } from "react-bootstrap";
import PropertyFilterModal from "../src/components/properties/PropertyFilterModal";



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
  const [openFilters, setOpenFilters] = useState(false);

  const totalPages = Math.ceil(total / pageSize);
  const enabledCategories = getEnabledCategories(properties);

  const goToPage = (p: number) => {
    router.push(`/properties?page=${p}&pageSize=${pageSize}`);
  };

  const Row = ({ index, style }: RowComponentProps) => (
    <div style={style}>
      <PropertyCategory properties={properties} category={enabledCategories[index]} />
    </div>
  );

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
      <PropertyFilterModal show={openFilters} onClose={() => setOpenFilters(false)} />
    </div>
  );
}




