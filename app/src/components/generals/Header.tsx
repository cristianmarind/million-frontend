'use client'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import _ from 'lodash';

import { FilterFormData, mapFormDataToQuery, PROPERTY_FILTER_CONTEXT, useFilters } from "@/app/src/state/FiltersContext";
import { toQueryParams } from "@/app/properties/PropertiesView";


const menuItems = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Who we are", href: "/who-we-are" },
  { label: "Contact us", href: "/contact-us" },
];

export default function Header() {
  const router = useRouter();
  const { filters } = useFilters(PROPERTY_FILTER_CONTEXT);

  const goToPage = (href: string) => {    
    if (href === "/properties") {
      const contextFilter = _.filter(filters, { context: PROPERTY_FILTER_CONTEXT });
      const newCurrentFilter: Partial<FilterFormData> = contextFilter.reduce((accum, item) => ({
        ...accum,
        [item.key]: item.value,
      }), {});
      
      const query = mapFormDataToQuery(newCurrentFilter)
      if (!_.isEmpty(query)) {
        const queryParams = toQueryParams(query)
        
        router.push(`/properties?${queryParams}`);
        return
      }
    }
    
      router.push(href);
  }

  return (
    <header className="px-4 mx-0" role="banner">
      <div className="row">
        <div className="col-12 col-md-4 mb-3 mt-1 d-flex align-items-center justify-content-center justify-content-md-start">
          <Link href="/" aria-label="InDise - Ir al inicio">
            <Image
              src="/logo.avif"
              alt="Logo de InDise Arquitectura"
              loading="eager"
              width={200}
              height={60}
              sizes="200px"
              priority
            />
          </Link>
        </div>
        <div className="col-12 col-md-8 mb-3 d-flex align-items-center justify-content-center justify-content-md-end">
          <nav role="navigation" aria-label="Navegación principal">
            <ul className="d-flex gap-4 mt-2 list-unstyled mb-0">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <button
                    className="btn btn-link text-decoration-none p-0 border-0 bg-transparent text-light"
                    onClick={() => goToPage(item.href)}
                    aria-label={`Ir a ${item.label}`}
                    type="button"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
