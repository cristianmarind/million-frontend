'use client'
import React from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
  showDetails?: boolean;
  className?: string;
}

export default function ErrorMessage({ 
  error, 
  onRetry, 
  title = "Error al cargar los datos",
  showDetails = false,
  className = ""
}: ErrorMessageProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                        errorMessage.toLowerCase().includes('fetch') ||
                        errorMessage.toLowerCase().includes('connection');

  const getErrorIcon = () => {
    if (isNetworkError) {
      return <WifiOff className="text-danger mb-3" size={48} aria-hidden="true" />;
    }
    return <AlertCircle className="text-danger mb-3" size={48} aria-hidden="true" />;
  };

  const getErrorTitle = () => {
    if (isNetworkError) {
      return "Problema de conexión";
    }
    return title;
  };

  const getErrorDescription = () => {
    if (isNetworkError) {
      return "No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.";
    }
    return "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.";
  };

  return (
    <div className={`d-flex flex-column align-items-center justify-content-center p-4 ${className}`}>
      <div className="text-center">
        {getErrorIcon()}
        <h3 className="h5 mb-3">{getErrorTitle()}</h3>
        <p className="text-muted mb-4">{getErrorDescription()}</p>
        
        {onRetry && (
          <button 
            className="btn btn-primary"
            onClick={onRetry}
            aria-label="Reintentar operación"
          >
            <RefreshCw className="me-2" size={16} />
            Reintentar
          </button>
        )}

        {showDetails && process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-start">
            <summary className="btn btn-sm btn-outline-secondary">
              Ver detalles del error
            </summary>
            <div className="mt-2 p-3 bg-light rounded">
              <pre className="small text-danger mb-0">
                {errorMessage}
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// Componente específico para errores de propiedades
export function PropertiesErrorMessage({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <ErrorMessage 
      error={error}
      onRetry={onRetry}
      title="Error al cargar las propiedades"
      showDetails={true}
      className="py-5"
    />
  );
}

// Componente específico para errores de detalles de propiedad
export function PropertyDetailsErrorMessage({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <ErrorMessage 
      error={error}
      onRetry={onRetry}
      title="Error al cargar los detalles de la propiedad"
      showDetails={true}
      className="py-5"
    />
  );
}
