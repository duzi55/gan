'use client';

/**
 * 文章编辑器 —— /admin 后台的写作与保存视图
 * 2026-08-27 Claude·静态博客在线后台：
 *   - 职责：读取单篇原文 → 拆解 frontmatter 填入表单 → 编辑正文 →
 *     序列化回 md → 经 GitHub Contents API 提交 commit；
 *   - 提交落库即触发云端构建剧本（cloud-build.yml），无需任何手工发布动作；
 *   - 新建模式：entry 为 null，需填写 slug 作为文件名；
 *   - 更新模式携带 entry.sha 作乐观锁，防止覆盖他人提交。
 */

import { useEffect, useState } from 'react';
import { getPost, savePost, type PostFileEntry } from '@/lib/github';
import {
  parseFrontmatter,
  serializeFrontmatter,
  DEFAULT_GRADIENT,
  DEFAULT_ACCENT,
} from '@/lib/frontmatter';

interface Props {
  token: string;
  /** 正在编辑的文章条目；null 表示新建模式 */
  entry: PostFileEntry | null;
  /** 保存成功后回调父容器（刷新列表并返回列表视图） */
  onSaved: () => void;
  /** 放弃编辑返回列表 */
  onBack: () => void;
}

/** 表单里 tags 用逗号分隔字符串承载，序列化时再转数组 */
interface FormState {
  title: string;
  date: string;
  excerpt: string;
  tagsInput: string;
  gradient: string;
  accent: string;
  body: string;
  slug: string; // 仅新建模式使用
}

const EMPTY_FORM = (): FormState => ({
  title: '',
  date: new Date().toISOString().slice(0, 10),
  excerpt: '',
  tagsInput: '',
  gradient: DEFAULT_GRADIENT,
  accent: DEFAULT_ACCENT,
  body: '\n\n',
  slug: '',
});

/** 统一输入框样式（墨境纸面风） */
const inputCls =
  'mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 font-serif text-sm text-foreground placeholder:text-muted/50 focus:border-accent/45 focus:outline-none';
const labelCls = 'block text-xs tracking-wider text-muted';

export function PostEditor({ token, entry, onSaved, onBack }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sha, setSha] = useState<string | undefined>(entry?.sha); // 乐观锁
  const [phase, setPhase] = useState<'loading' | 'editing' | 'saving'>('loading');
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState(''); // 保存成功的 commit 链接

  /* ═══ 首次打开：拉取原文并填充表单 ═══ */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPhase('loading');
      setError('');
      if (!entry) {
        if (!cancelled) { setForm(EMPTY_FORM()); setSha(undefined); setPhase('editing'); }
        return;
      }
      try {
        const raw = await getPost(token, entry.path);
        const { meta, body } = parseFrontmatter(raw);
        if (cancelled) return;
        setForm({
          title: meta.title,
          date: meta.date || EMPTY_FORM().date,
          excerpt: meta.excerpt,
          tagsInput: meta.tags.join(', '),
          gradient: meta.gradient,
          accent: meta.accent,
          body,
          slug: entry.name.replace(/\.md$/, ''),
        });
        setPhase('editing');
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => { cancelled = true; };
  }, [token, entry]);

  const editingNew = entry === null;
  const canSave =
    phase === 'editing' &&
    form.title.trim() !== '' &&
    form.excerpt.trim() !== '' &&
    (editingNew ? /^[a-z0-9][a-z0-9-]*$/.test(form.slug) : true);

  /** 受控更新单个表单字段 */
  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  /* ═══ 保存：拼装 md → PUT Contents API ═══ */
  async function handleSave() {
    setPhase('saving');
    setError('');
    setResultUrl('');
    try {
      const metaObj = {
        title: form.title.trim(),
        date: form.date,
        excerpt: form.excerpt.trim(),
        tags: form.tagsInput.split(/[,，]/).map(s => s.trim()).filter(Boolean),
        gradient: form.gradient.trim() || DEFAULT_GRADIENT,
        accent: form.accent.trim() || DEFAULT_ACCENT,
      };
      const markdown = serializeFrontmatter(metaObj, form.body);
      const path = editingNew
        ? `content/posts/${form.slug}.md`
        : entry!.path;
      const message = `${editingNew ? 'post: 新增' : 'post: 更新'}《${metaObj.title}》（墨境后台提交）`;

      const result = await savePost(token, { path, sha, content: markdown, message });
      setSha(result.sha); // 记录新 sha，本次停留继续编辑也不冲突
      setResultUrl(result.commitUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPhase('editing');
    }
  }

  if (phase === 'loading') {
    return <p className="py-16 text-center font-serif text-sm text-muted">正在加载文章…</p>;
  }

  return (
    <div>
      {/* ═══ 工具条 ═══ */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <button onClick={onBack} className="text-sm text-muted transition-colors hover:text-accent">
          ← 返回列表
        </button>
        <span className="font-serif text-xs text-muted">
          {editingNew ? '新建文章' : `编辑 ${entry!.name}`}
        </span>
      </div>

      {/* ═══ 提示区 ═══ */}
      {error && (
        <p className="mt-4 rounded-sm border border-red-900/40 bg-red-950/20 px-4 py-3 font-serif text-sm text-red-300">
          {error}
        </p>
      )}
      {resultUrl && (
        <div className="mt-4 rounded-sm border border-accent/40 bg-accent/5 px-4 py-3 font-serif text-sm text-accent">
          已提交，云端构建已自动触发，约 1–2 分钟后生效。
          <a href={resultUrl} target="_blank" rel="noreferrer" className="ml-2 underline underline-offset-2">
            查看这次提交
          </a>
        </div>
      )}

      {/* ═══ 元信息表单 ═══ */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelCls}>标题 *</label>
          <input className={inputCls} value={form.title}
            onChange={e => patch('title', e.target.value)} placeholder="文章标题" />
        </div>

        {/* 文件名 slug 只在新建时可填 */}
        {editingNew && (
          <div>
            <label className={labelCls}>文件名 slug *（小写字母/数字/连字符）</label>
            <input className={inputCls} value={form.slug}
              onChange={e => patch('slug', e.target.value)} placeholder="my-first-post" />
            <p className="mt-1 font-serif text-xs text-muted">将保存为 content/posts/{form.slug || '…'}.md</p>
          </div>
        )}

        <div>
          <label className={labelCls}>日期</label>
          <input type="date" className={inputCls} value={form.date}
            onChange={e => patch('date', e.target.value)} />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>摘要 *（显示在首页列表中）</label>
          <textarea className={`${inputCls} resize-none`} rows={2} value={form.excerpt}
            onChange={e => patch('excerpt', e.target.value)}
            placeholder="一句话摘要" />
        </div>

        <div>
          <label className={labelCls}>标签（逗号分隔）</label>
          <input className={inputCls} value={form.tagsInput}
            onChange={e => patch('tagsInput', e.target.value)} placeholder="前端, 设计" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>强调色 accent</label>
            <input className={inputCls} value={form.accent}
              onChange={e => patch('accent', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>封面渐变 gradient</label>
            <input className={inputCls} value={form.gradient}
              onChange={e => patch('gradient', e.target.value)} />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>正文（Markdown）</label>
          <textarea className={`${inputCls} min-h-[45vh] leading-relaxed`} value={form.body}
            onChange={e => patch('body', e.target.value)}
            spellCheck={false} placeholder={'## 在这里开始写正文'} />
        </div>
      </div>

      {/* ═══ 保存 ═══ */}
      <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <button onClick={handleSave} disabled={!canSave}
          className="rounded-sm border border-accent/45 bg-surface px-6 py-2.5 text-sm text-accent transition-colors hover:bg-accent/10 disabled:opacity-40 disabled:hover:bg-surface">
          {phase === 'saving' ? '提交中…' : editingNew ? '创建并触发发布' : '保存并触发发布'}
        </button>
        <p className="font-serif text-xs text-muted">保存即向仓库提交一次 commit，云端自动构建发布</p>
      </div>
    </div>
  );
}
