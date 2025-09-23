import 'server-only'
import { NextResponse } from 'next/server';
import _ from "lodash";
import { headers } from 'next/headers';
import { getLocationFromIP, getUserIP } from '@/app/src/utils/location';
import { GetPropertiesByFilters } from '@/app/src/core/infraestructure/controllers/PropertiesController';
import { mapSearchParamsToProperties } from '../../../properties/mappers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query: Record<string, string> = Object.fromEntries(searchParams.entries());

  if (process.env.NODE_ENV === "development" && (!query.latitude || !query.longitude)) {
    const headersList = await headers()
    const ip = await getUserIP(headersList);
    const { longitude, latitude } = await getLocationFromIP(ip);
    Object.assign(query, { longitude, latitude })
  }

  try {
    const filters = mapSearchParamsToProperties(query);
    
    const properties = await GetPropertiesByFilters.execute(filters);
    
    return NextResponse.json(properties.map((p: any) => ({ ...p, isNear: true })));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}