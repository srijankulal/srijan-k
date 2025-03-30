import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'wqvndanjead1tl5k.public.blob.vercel-storage.com',
        port: '',
        pathname: '**',
      },
      
    ],
  },
  /* config options here */
};

export default nextConfig;
