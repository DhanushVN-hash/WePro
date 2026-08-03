import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.29.199"],
    images: {
    qualities: [70, 75],
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