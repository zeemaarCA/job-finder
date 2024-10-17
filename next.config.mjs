/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@prisma/client'],
  images: {
    domains: ['lh3.googleusercontent.com', 'source.unsplash.com', 'fakestoreapi.com', 'images.pexels.com', 'firebasestorage.googleapis.com', 'via.placeholder.com', 'www.hostinger.com', 'img.clerk.com'],
  },

};

export default nextConfig;
