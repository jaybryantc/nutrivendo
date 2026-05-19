import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "media.base44.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "cdn.accentuate.io" },
      { protocol: "https", hostname: "thedomesticgeek.com" },
      { protocol: "https", hostname: "www.skinnytaste.com" },
    ],
  },
};

export default nextConfig;
