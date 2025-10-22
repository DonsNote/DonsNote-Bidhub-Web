import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // 개발 환경에서 외부 IP 접근 허용
  allowedDevOrigins: [
    'http://52.184.83.107:3000',
    'http://52.184.83.107',
  ],
};

export default nextConfig;
