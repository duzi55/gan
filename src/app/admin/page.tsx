import type { Metadata } from 'next';
import { AdminApp } from '@/components/admin/AdminApp';

/**
 * /admin 页面入口 —— 墨境静态博客在线后台
 * 2026-08-27 Claude·静态博客在线后台：
 *   - 纯客户端应用（AdminApp 内自管鉴权/列表/编辑三个子视图），
 *     页面本体只负责元信息与挂载；
 *   - robots noindex：后台不进搜索引擎索引。
 */

export const metadata: Metadata = {
  title: '后台管理',
  // 禁止收录与跟踪链接，避免后台被搜索引擎暴露
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="min-h-[80vh] bg-background text-foreground">
      <AdminApp />
    </div>
  );
}
