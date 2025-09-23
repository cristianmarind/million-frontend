"use client";
import dynamic from 'next/dynamic';
import Property from '../src/core/domain/Property';

// Lazy load the properties view to improve TTI
const PropertiesView = dynamic(() => import("./PropertiesView"), {
  loading: () => (
    <div className="d-flex justify-content-center p-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Cargando propiedades...</span>
      </div>
    </div>
  )
});

interface PropertiesViewWrapperProps {
  properties: Property[];
}

export default function PropertiesViewWrapper({ properties }: PropertiesViewWrapperProps) {
  return <PropertiesView properties={properties} />;
}
