"use client";

import { useRouter } from "next/navigation";
import { List, RowComponentProps } from 'react-window';

import Property from "../src/core/domain/Property";
import PropertyHeroCard from "../src/components/PropertyHeroCard";
import PropertyListCard from "../src/components/PropertyListCard";



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

  const goToPage = (p: number) => {
    router.push(`/properties?page=${p}&pageSize=${pageSize}`);
  };

  const Row = ({ index, style }: RowComponentProps) => (
    <div style={style}>
      <PropertyListCard property={properties[index + 1]} />
    </div>
  );

  return (
    <div>
      <div className="container mx-auto p-4">
        {properties.length > 0 && (
          <PropertyHeroCard property={properties[0]} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <List
            rowComponent={Row}
            rowCount={properties.length - 1}
            rowHeight={600}
            overscanCount={2}
            rowProps={{  }}
          />
        </div>
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




