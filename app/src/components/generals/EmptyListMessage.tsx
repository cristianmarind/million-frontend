'use client'
import { CircleAlert } from 'lucide-react'
import { Button } from 'react-bootstrap';

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Who we are", href: "/who-we-are" },
  { label: "Contact us", href: "/contact-us" },
];

interface EmptyListMessageProps {
  onClearFilter: () => void
}
export default function EmptyListMessage({
  onClearFilter
}: EmptyListMessageProps) {
  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex justify-content-center align-items-center mb-2">
        <CircleAlert className="me-2" style={{ width: '20px', height: '20px' }} />
        No hay datos con los filtros aplicados
      </div>
      <Button variant="light" onClick={onClearFilter}>Limpiar filtros</Button>
    </div>

  );
}
