"use client";
import dynamic from "next/dynamic";

// Lazy load WhatsApp button with client-side rendering
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), {
  ssr: false,
  loading: () => null
});

export default function WhatsAppButtonWrapper() {
  return <WhatsAppButton />;
}
