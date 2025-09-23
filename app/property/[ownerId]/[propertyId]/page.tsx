import 'server-only'
import { notFound } from 'next/navigation';
import _ from "lodash";
import Carousel from 'react-bootstrap/Carousel';

import { GetOwnersByFilters } from '@/app/src/core/infraestructure/controllers/OwnersController';
import { GetPropertiesByFilters } from '@/app/src/core/infraestructure/controllers/PropertiesController';
import Owner from '@/app/src/core/domain/Owner';
import Property from '@/app/src/core/domain/Property';
import PropertyView from './PropertyView';

export const dynamicParams = true;
export const revalidate = 86400;

interface PropertyPageProps {
  params: { ownerId: string; propertyId: string };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { ownerId, propertyId } = params;

  const [owners, properties] = await Promise.all([
    GetOwnersByFilters.execute({ ownersId: [ownerId] }),
    GetPropertiesByFilters.execute({
      propertyId,
      page: 1,
      pageSize: 1,
    }),
  ]);

  const owner: Owner = owners[0];
  const property: Property = properties[0];

  if (!owner || !property) {
    notFound();
  }

  return (
    <PropertyView owner={owner} property={property} />
  );
}