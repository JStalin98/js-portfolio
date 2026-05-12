import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage — profile images and project diagrams
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Brand-matched placeholder images for development/seed
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
