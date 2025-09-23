'use client'
import Image from 'next/image';
import Card from 'react-bootstrap/Card';
import { useRouter } from "next/navigation";

import Property from '../../core/domain/Property';

interface PropertyHeroCardProps {
  property: Property;
}

export default function PropertyHeroCard({ property }: PropertyHeroCardProps) {
  const router = useRouter();

  const goToPropertyPage = () => {
    router.push(`/property/${property.ownerId}/${property.id}`);
  };

  return (
    <Card
      className="property-hero-card cursor-pointer bg-white shadow overflow-hidden position-relative border-0"
      onClick={goToPropertyPage}
    >
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
      <Card.Body className="position-absolute bottom-0 end-0 text-dark bg-white p-3 rounded-3 m-3">
        <Card.Title className="h6 fw-bold mb-1">{property.name}</Card.Title>
        <Card.Text className="small mb-1">{property.address}</Card.Text>
        <Card.Text className="h5 fw-semibold mb-0">
          ${property.price.toLocaleString()}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}