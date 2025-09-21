// src/presentation/components/properties/PropertyListCard.tsx
import Image from 'next/image';
import Card from 'react-bootstrap/Card';
import Property from '../../core/domain/Property';

interface PropertyListCardProps {
  property: Property;
}

export default function PropertyListCard({ property }: PropertyListCardProps) {
  return (
    <Card className="property-list-card bg-white shadow-sm overflow-hidden d-flex flex-column mx-2">
      <Image
        src={property.imageUrls[0] || '/placeholder.jpg'}
        alt={property.name}
        width={300}// requerido por Next.js (no define el render final)
        height={192}
        className="w-100"
        style={{ height: '10em', objectFit: 'cover' }}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = '/placeholder.jpg'; // Fallback si falla
        }}
        loading="lazy" // Carga diferida
      />
      <Card.Body className="p-3 text-dark">
        <Card.Title className="h6 fw-semibold text-truncate">{property.name}</Card.Title>
        <Card.Text className="small text-muted text-truncate">{property.address}</Card.Text>
        <Card.Text className="small fw-medium">
          ${property.price.toLocaleString()}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}