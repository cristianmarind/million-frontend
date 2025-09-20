// src/presentation/components/properties/PropertyHeroCard.tsx
import Image from 'next/image';
import Property from '../core/domain/Property';

interface PropertyHeroCardProps {
  property: Property;
}

export default function PropertyHeroCard({ property }: PropertyHeroCardProps) {
  return (
    <div className="property-hero-card bg-white shadow-md overflow-hidden relative">
      <Image
        src={property.imageUrls[0] || '/placeholder.jpg'}
        alt={property.name}
        width={0} // Set to 0 when using `sizes` and `style` for responsive width
        height={0} // Set to 0 when using `sizes` and `style` for responsive height
        sizes="100vw" // Indicates the image will be as wide as the viewport
        className="hero-card-image"
        style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'cover', objectPosition: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 1)' }} // Responsive width and height
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = '/placeholder.jpg'; // Fallback si falla
        }}
        loading="eager"
      />
      <div className="absolute bottom-4 right-2 text-black bg-white p-2 rounded-xl">
        <h2 className="text-md font-bold">{property.name}</h2>
        <p className="text-sm">{property.address}</p>
        <p className="text-xl font-semibold mt-2">
          ${property.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}