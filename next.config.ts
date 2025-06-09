import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // 注意：由于我们现在有了 /api/stream_answer 路由，
      // 这个 rewrite 规则不会匹配到它，因为 Next.js API 路由优先级更高
      {
        source: "/api/:path*",
        destination: `${
          process.env.BACKEND_URL || "http://localhost:8000"
        }/:path*`,
      },
    ];
  },
  // 为了确保流式响应正常工作，添加以下配置
  experimental: {
    // 启用流式服务器端渲染支持
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
