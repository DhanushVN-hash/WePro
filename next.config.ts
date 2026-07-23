import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.29.199"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cjylhmszsqngvxqvjixm.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};



export default nextConfig;