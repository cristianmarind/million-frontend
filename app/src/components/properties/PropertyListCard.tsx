'use client'
import Image from 'next/image';
import Card from 'react-bootstrap/Card';
import { useRouter } from "next/navigation";

import Property from '../../core/domain/Property';

interface PropertyListCardProps {
  property: Property;
}

export default function PropertyListCard({ property }: PropertyListCardProps) {
  const router = useRouter();

  const goToPropertyPage = () => {
    router.push(`/property/${property.ownerId}/${property.id}`);
  };

  return (
    <Card
      className="bg-white shadow-sm overflow-hidden d-flex flex-column mx-2 cursor-pointer"
      onClick={goToPropertyPage}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToPropertyPage();
        }
      }}
      aria-label={`Ver detalles de ${property.name} - ${property.address}`}
    >
      <div style={{ position: "relative", width: "100%", height: "160px" }}>
        <Image
          src={property.imageUrls[0] || '/placeholder.jpg'}
          alt={`Imagen de ${property.name}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/placeholder.jpg';
          }}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>
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