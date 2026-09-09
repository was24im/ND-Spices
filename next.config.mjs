/** @type {import('next').NextConfig} */

// Ensure NEXTAUTH_URL and NEXTAUTH_SECRET are always valid strings during build & SSR
const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.trim() !== '') {
    return process.env.NEXTAUTH_URL.trim();
  }
  if (process.env.VERCEL_URL && process.env.VERCEL_URL.trim() !== '') {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }
  return 'https://ndspices.com';
};

const resolvedBaseUrl = getBaseUrl();
process.env.NEXTAUTH_URL = resolvedBaseUrl;

if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.trim() === '') {
  process.env.NEXTAUTH_SECRET = 'nd_spices_super_secret_local_dev_jwt_key_2025';
}

if (!process.env.NEXTAUTH_URL_INTERNAL || process.env.NEXTAUTH_URL_INTERNAL.trim() === '') {
  delete process.env.NEXTAUTH_URL_INTERNAL;
}

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: resolvedBaseUrl,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
    ],
  },
};

export default nextConfig;
