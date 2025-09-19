// src/presentation/components/properties/PropertyHeroCard.tsx
import Image from 'next/image';
import Property from '../core/domain/Property';

interface PropertyHeroCardProps {
  property: Property;
}

export default function PropertyHeroCard({ property }: PropertyHeroCardProps) {
  return (
    <div className="property-hero-card bg-white rounded-lg shadow-md overflow-hidden relative">
      <div className="relative w-full h-64">
        <Image
          src={property.imageUrls[0] || '/placeholder.jpg'}
          alt={property.name}
          width={600}
          height={256}
          style={{ objectFit: 'cover' }}
          className="absolute"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/placeholder.jpg'; // Fallback si falla
          }}
          loading="lazy" // Carga diferida para mejorar performance
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold">{property.name}</h2>
        <p className="text-gray-600">{property.address}</p>
        <p className="text-2xl font-semibold mt-2">
          ${property.price.toLocaleString()}
        </p>
      </div>
      <style jsx>{`
        .property-hero-card {
          max-width: 100%;
        }
        @media (min-width: 768px) {
          .property-hero-card {
            max-width: 600px;
          }
        }
      `}</style>
    </div>
  );
}