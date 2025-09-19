// src/presentation/components/properties/PropertyListCard.tsx
import Image from 'next/image';
import Property from '../core/domain/Property';

interface PropertyListCardProps {
  property: Property;
}

export default function PropertyListCard({ property }: PropertyListCardProps) {
  return (
    <div className="property-list-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        <Image
          src={property.imageUrls[0] || '/placeholder.jpg'}
          alt={property.name}
          width={300}
          height={192}
          style={{ objectFit: 'cover' }}
          className="absolute"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/placeholder.jpg'; // Fallback si falla
          }}
          loading="lazy" // Carga diferida
        />
      </div>
      <div className="p-3">
        <h3 className="text-lg font-semibold">{property.name}</h3>
        <p className="text-sm text-gray-600">{property.address}</p>
        <p className="text-md font-medium mt-1">
          ${property.price.toLocaleString()}
        </p>
      </div>
      <style jsx>{`
        .property-list-card {
          max-width: 100%;
          width: 300px;
        }
        @media (min-width: 768px) {
          .property-list-card {
            width: 250px;
          }
        }
      `}</style>
    </div>
  );
}