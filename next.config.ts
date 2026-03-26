import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vrbs-assets.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;