'use client'
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'spinner-border-sm',
  md: '',
  lg: 'spinner-border-lg'
};

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32
};

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Cargando...', 
  className = '',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const content = (
    <div className={`d-flex flex-column align-items-center justify-content-center ${className}`}>
      <div className="d-flex align-items-center">
        <Loader2 
          className="spinner-border text-primary me-2" 
          size={iconSizes[size]}
          style={{ animation: 'spin 1s linear infinite' }}
          aria-hidden="true"
        />
        <span className="text-muted">{text}</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="d-flex align-items-center justify-content-center" 
        style={{ minHeight: '50vh' }}
        role="status"
        aria-live="polite"
      >
        {content}
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite">
      {content}
    </div>
  );
}

// Componente específico para propiedades
export function PropertiesLoadingSpinner() {
  return (
    <LoadingSpinner 
      text="Cargando propiedades..." 
      fullScreen 
      className="p-5"
    />
  );
}

// Componente específico para detalles de propiedad
export function PropertyDetailsLoadingSpinner() {
  return (
    <LoadingSpinner 
      text="Cargando detalles de la propiedad..." 
      fullScreen 
      className="p-5"
    />
  );
}

// Componente para botones con loading
export function LoadingButton({ 
  loading, 
  children, 
  ...props 
}: { 
  loading: boolean; 
  children: React.ReactNode; 
  [key: string]: any;
}) {
  return (
    <button 
      {...props} 
      disabled={loading || props.disabled}
      className={`${props.className || ''} ${loading ? 'position-relative' : ''}`}
    >
      {loading && (
        <Loader2 
          className="spinner-border-sm me-2" 
          size={16}
          style={{ animation: 'spin 1s linear infinite' }}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
