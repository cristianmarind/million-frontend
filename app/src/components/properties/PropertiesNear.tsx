'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Property from '@/app/src/core/domain/Property';
import PropertyCategory from './PropertyCategory';

interface Location {
  latitude: number;
  longitude: number;
}

export default function PropertiesNear() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 2000); // 2 segundos

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    handleGeoSearch();
  }, [searchParams]);

  const fetchNearProperties = async (latitude: number, longitude: number) => {
    try {
      const query = searchParams.toString()
      
      const response = await fetch(`/api/properties/nearby?latitude=${latitude}&longitude=${longitude}&${query}`, {
        method: 'GET',
        cache: 'no-store',
      });
      
      if (!response.ok) throw new Error('Error fetching nearby properties');
      const nearProperties = await response.json();
      setProperties(nearProperties);
    } catch (error) {
      console.error('Error fetching near properties:', error);
    }
  };

  const handleGeoSearch = () => {
    if (navigator.geolocation) {
      setLoadingGeo(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetchNearProperties(latitude, longitude)
          setLocation({ latitude, longitude })
          setLoadingGeo(false);
          setError(null);
        },
        (err) => {
          setError('Error al obtener ubicación: ' + err.message);
          setLoadingGeo(false);
        }
      );
    }
  };

  const ActiveLocation = () => (
    <div className="d-flex flex-column justify-content-center align-items-center geo-prompt mb-3">
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-properties-near">
            Debes activar el permiso de ubicación
          </Tooltip>
        }
      >
        <Button variant="outline-light" onClick={handleGeoSearch} disabled={loadingGeo}>
          {loadingGeo ? 'Buscando...' : 'Buscar cerca de mí'}
        </Button>
      </OverlayTrigger>
    </div>
  )

  if (loadingGeo && show) return <div className="d-flex justify-content-center">Cargando ubicación...</div>;
  if (error && show) return <ActiveLocation />;

  return (
    <>
      {!location && (
        <ActiveLocation />
      )}
      <PropertyCategory properties={properties} category={0} />
    </>
  );
}