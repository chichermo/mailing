/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forzar que escuche en todas las interfaces
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Configuración de logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
