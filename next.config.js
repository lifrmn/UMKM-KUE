/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    unoptimized: true, // For base64 images
  },
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header
}

module.exports = nextConfig
