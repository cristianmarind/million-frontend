import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/web-indise-arquitectura.appspot.com/**',
      },
       {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/photo-**',
      },
    ],
    // Opciones adicionales para mejorar el manejo de imágenes
    minimumCacheTTL: 60, // Cachea imágenes por al menos 60 segundos
    disableStaticImages: false, // Habilita optimización de imágenes estáticas
  },
};

export default nextConfig;
