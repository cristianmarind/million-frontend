"use client";
import dynamic from 'next/dynamic';
import Property from '../src/core/domain/Property';
import { PropertiesLoadingSpinner } from '../src/components/generals/LoadingSpinner';
import ErrorBoundary from '../src/components/generals/ErrorBoundary';
import ErrorMessage from '../src/components/generals/ErrorMessage';

// Lazy load the properties view to improve TTI
const PropertiesView = dynamic(() => import("./PropertiesView"), {
  loading: () => <PropertiesLoadingSpinner />
});

interface PropertiesViewWrapperProps {
  properties: Property[];
}

export default function PropertiesViewWrapper({ properties }: PropertiesViewWrapperProps) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          error="Error al mostrar las propiedades"
          onRetry={() => window.location.reload()}
          title="Error al mostrar las propiedades"
          showDetails={true}
          className="py-5"
        />
      }
    >
      <PropertiesView properties={properties} />
    </ErrorBoundary>
  );
}
