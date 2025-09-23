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
    <header className="px-4 mx-0">
      <div className="row">
        <div className="col-12 col-md-4 mb-3 mt-1 d-flex align-items-center justify-content-center justify-content-md-start">
          <Link href="/">
            <Image
              src="/logo.avif"
              alt="Casa moderna en la ciudad"
              loading="eager"
              width={0}
              height={0}
              sizes="200px"
              style={{ width: "200px", height: "auto" }} 
            />
          </Link>
        </div>
        <div className="col-12 col-md-8 mb-3 d-flex align-items-center justify-content-center justify-content-md-end">
          <nav>
            <ul className="d-flex gap-4 mt-2 list-unstyled mb-0">
              {menuItems.map((item) => (
                <li
                  key={item.href}
                  className="cursor-pointer"
                  onClick={() => goToPage(item.href)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </nav>
        </div>

      </div>
    </header>
  );
}
