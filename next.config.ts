import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.BACKEND_URL || "http://localhost:8000"
        }/:path*`,
      },
    ];
  },
  // 使用新的配置选项
  serverExternalPackages: [],
};

export default nextConfig;
