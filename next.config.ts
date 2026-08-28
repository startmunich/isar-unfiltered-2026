import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
  },
  transpilePackages: ["meshline", "@react-three/drei", "@react-three/rapier"],
};

export default nextConfig;
