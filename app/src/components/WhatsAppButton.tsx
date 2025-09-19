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
      className="wpp-button fixed bottom-10 right-5 bg-black border-x-3 border-y-3 border-white hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
    >
      <MessageCircle size={28} />
      <div className="wpp-button-msg ml-2">
        <span className="text-xs">Contact us on WhatsApp</span>
      </div>
    </Link>
  );
}