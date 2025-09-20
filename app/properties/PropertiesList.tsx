"use client";

import { useRouter } from "next/navigation";
import { List, RowComponentProps } from 'react-window';
import _ from 'lodash';

import Property from "../src/core/domain/Property";
import PropertyHeroCard from "../src/components/PropertyHeroCard";
import PropertyCategory from "../src/components/PropertyCategory";
import { getEnabledCategories } from "../src/utils/propertiesRender";



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
      <div className="flex flex-col w-full mb-4">
        {properties.length > 0 && (
          <PropertyHeroCard property={properties[0]} />
        )}
      </div>
      <div className="mt-4 flex justify-center px-5">
        <List
          rowComponent={Row}
          rowCount={enabledCategories.length}
          rowHeight={350}
          overscanCount={2}
          rowProps={{}}
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}




