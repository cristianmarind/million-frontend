"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react"; // usando react-icons

export default function WhatsAppButton() {
  const phone = "573013989477"; // número en formato internacional sin "+"
  const message = "¡Hola! Estoy interesado en una propiedad."; // mensaje inicial

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="wpp-button position-fixed bg-dark text-white p-3 shadow d-flex align-items-center justify-content-center"
      style={{ bottom: '2.5rem', right: '1.25rem', border: '3px solid white' }}
      aria-label="Contactar por WhatsApp"
      role="button"
    >
      <MessageCircle size={28} aria-hidden="true" />
      <div className="wpp-button-msg ms-2">
        <span className="small">Contact us on WhatsApp</span>
      </div>
    </Link>
  );
}