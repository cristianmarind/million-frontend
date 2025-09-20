// src/presentation/components/properties/PropertyListCard.tsx
import Image from 'next/image';
import Property from '../core/domain/Property';

interface PropertyListCardProps {
  property: Property;
}

export default function PropertyListCard({ property }: PropertyListCardProps) {
  return (
    <div className="property-list-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col mx-2">
      <div>
        <Image
          src={property.imageUrls[0] || '/placeholder.jpg'}
          alt={property.name}
          width={300}// requerido por Next.js (no define el render final)
          height={192}
          className="w-full h-[10em] object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/placeholder.jpg'; // Fallback si falla
          }}
          loading="lazy" // Carga diferida
        />
      </div>
      <div className="p-3 text-black">
        <h3 className="text-sm font-semibold">{property.name}</h3>
        <p className="text-xs text-gray-600 truncate">{property.address}</p>
        <p className="text-sm font-medium mt-1">
          ${property.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}