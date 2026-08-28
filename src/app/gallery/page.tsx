import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * /gallery 旧路径兼容页
 * 2026-08-28 Claude·画廊已由「灵感」页取缔：
 *   - 静态托管（GitHub Pages）无服务端重定向，改用 meta refresh
 *     （React 19 自动将 <meta> 提升至 <head>），零 JS；
 *   - URL 前缀读 NEXT_PUBLIC_BASE_PATH（构建期内联），本地与 /gan 子路径均正确；
 *   - 同时保留可点击链接兜底（个别浏览器禁用 meta refresh）。
 */

export const metadata: Metadata = {
  title: '页面已迁移',
  robots: { index: false },
};

export default function GalleryRedirectPage() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      {/* 旧 /gallery → 新 /inspiration（零 JS 重定向） */}
      <meta httpEquiv="refresh" content={`0;url=${base}/inspiration/`} />
      <div className="text-center">
        <p className="font-serif text-sm text-muted">画廊已由「灵感」取缔，正在带你前往……</p>
        <Link href="/inspiration" className="mt-3 inline-block text-sm text-accent underline underline-offset-4">
          点此立即跳转
        </Link>
      </div>
    </main>
  );
}
