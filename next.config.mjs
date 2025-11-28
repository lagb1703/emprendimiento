/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fix for Turbopack path resolution issues
  experimental: {
    turbo: {
      resolveAlias: {
        // Ensure proper path resolution
        '@': './src',
        '@/components': './components',
        '@/lib': './lib',
        '@/app': './app',
      },
    },
    // Disable server components for problematic areas if needed
    serverComponentsExternalPackages: [],
  },
  // Better handling of file paths with spaces
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Add fallbacks for development mode
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    return config
  },
}

export default nextConfig
