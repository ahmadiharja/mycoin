/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Menonaktifkan floating icon Next.js
  devIndicators: false,
  // Menyembunyikan pesan overlay error development
  reactStrictMode: true,
  onDemandEntries: {
    // Menonaktifkan overlay error development
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
