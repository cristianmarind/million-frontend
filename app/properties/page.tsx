import 'server-only'
import PropertiesList from "./PropertiesList";
import { GetPropertiesByFilters } from '../src/core/infraestructure/controllers/PropertiesController';

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const pageSize = Number(searchParams.pageSize ?? 5);

  // Aquí llamas tu función server-side
  const properties = await GetPropertiesByFilters.execute({
    page,
    pageSize,
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Listado de propiedades</h1>
      <PropertiesList
        properties={properties}
        total={100} // Simulando un total fijo
        page={page}
        pageSize={pageSize}
      />
    </div>
  );
}