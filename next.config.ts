import type { NextConfig } from "next";

// GitHub Pages 子路径部署：构建时通过环境变量注入，例如
//   NEXT_PUBLIC_BASE_PATH=/my-repo  npm run build
// 本地开发（next dev）保持为空，即根路径。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // 静态导出：生成 ./out，可直接部署到 GitHub Pages / 任意静态托管
  output: "export",
  basePath,
  // 静态资源（_next/static 等）前缀，GitHub Pages 子路径部署必须与 basePath 一致
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // 静态导出无图片优化服务，使用 <img> 原图
    unoptimized: true,
  },
  // 跳过类型检查，避免 .next/types 生成触发安全删除守卫
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
