"use client";

import { useRouter } from "next/navigation";
import Property from "../src/core/domain/Property";

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

  return (
    <div>
      <ul className="space-y-2">
        {properties.map((p) => (
          <li
            key={p.name}
            className="border p-2 rounded-md shadow-sm bg-white"
          >
            {p.name}
          </li>
        ))}
      </ul>

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