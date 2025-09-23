'use client'
import _ from "lodash";
import Carousel from 'react-bootstrap/Carousel';

import Owner from '@/app/src/core/domain/Owner';
import Property from '@/app/src/core/domain/Property';
import { useState } from "react";
import Image from "next/image";
import PropertyCard from "@/app/src/components/properties/PropertyCard";

export const dynamicParams = true;
export const revalidate = 86400;

interface PropertyViewProps {
  owner: Owner;
  property: Property
}

export default function PropertyView({ owner, property }: PropertyViewProps) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };
  return (
    <div className="d-flex flex-column">
      <div className="property-view-images">
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {
            property.imageUrls.map((imageUrl, imageIndex) => (
              <Carousel.Item key={imageUrl}>
                <div>
                  <Image
                    src={imageUrl || '/placeholder.jpg'}
                    alt={'Imagen ' + imageIndex}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="hero-card-image"
                    style={{ width: '100%', height: '70vh', objectFit: 'cover', objectPosition: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 1)' }} // Responsive width and height
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = '/placeholder.jpg'; // Fallback si falla
                    }}
                    loading="eager"
                  />
                </div>

              </Carousel.Item>
            ))
          }
        </Carousel>
      </div>
      <PropertyCard owner={owner} property={property} />
    </div>
  );
}