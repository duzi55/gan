'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * Newsletter — 订阅入口
 * 从 MessageInput 抽离视觉模式，改为邮件订阅
 * 用于页脚
 */
export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <GlassCard className="p-6">
      <div className="text-center">
        <h3 className="font-serif text-lg font-medium text-zinc-100">订阅更新</h3>
        <p className="mt-2 text-sm text-zinc-400">
          新文章发布时收到邮件通知，不发广告，不卖地址。
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-5 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-white/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitted}
          className="shrink-0 rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:opacity-50"
        >
          {submitted ? '已订阅' : '订阅'}
        </button>
      </form>
    </GlassCard>
  );
}
