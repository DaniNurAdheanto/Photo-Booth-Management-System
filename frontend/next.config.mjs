/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Support server-side TypeORM instrumentation
  experimental: {
    serverComponentsExternalPackages: ['typeorm', 'pg'],
  },
  env: {
    APP_NAME: 'Photo Booth Management System',
  },
};

export default nextConfig;
