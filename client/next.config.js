/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: false
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_MAP_API_KEY: process.env.NEXT_PUBLIC_MAP_API_KEY
  },
  webpack: (config) => {
    console.log('Webpack config loaded:', config.mode); // Debug log
    return config;
  },
};

module.exports = nextConfig;
