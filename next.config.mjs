import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  trailingSlash: true, // 确保URL都带尾部斜杠，与canonical保持一致
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  
  // Webpack 配置：排除客户端打包时的 Node.js 模块
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端打包时，忽略这些 Node.js 模块
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        perf_hooks: false,
      };
    }
    return config;
  },
  
  // 新增：超安全的性能优化
  compress: true, // 启用gzip压缩
  poweredByHeader: false, // 隐藏X-Powered-By响应头
  swcMinify: true, // 启用SWC压缩器
  
  images: {
    formats: ['image/webp', 'image/avif'], // 支持现代格式（不强制使用）
    minimumCacheTTL: 2592000, // 30天缓存
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/undefined",
        destination: "/",
        permanent: true,
      },
      // ✅ 删除所有UTM参数的重定向规则
      // 让robots.txt处理SEO，保留UTM追踪功能
    ];
  },
};

// Make sure experimental mdx flag is enabled
const configWithMDX = {
  ...nextConfig,
  experimental: {
    mdxRs: true,
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(configWithMDX)));
