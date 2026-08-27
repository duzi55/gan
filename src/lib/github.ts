/**
 * GitHub Contents API 封装 —— /admin 后台读写 content/posts/*.md
 * 2026-08-27 Claude·静态博客在线后台：
 *   - 令牌来自 OAuth（Cloudflare Worker 网关 https://auth.1375744701.workers.dev），
 *     scope 仅 public_repo，仅存浏览器 localStorage；
 *   - 每次保存 = 调用 Contents API 提交一个 commit 到 main 分支，
 *     push 落库后自动触发 .github/workflows/cloud-build.yml 云端构建发布。
 * API 参考：https://docs.github.com/rest/contents/contents
 */

/** 仓库归属与分支常量（git remote: duzi55/gan，Pages 从 main 分支 /docs 部署） */
const OWNER = 'duzi55';
const REPO = 'gan';
export const BRANCH = 'main';
/** 文章目录在仓库中的路径 */
const POSTS_DIR = 'content/posts';
/** OAuth 登录入口（Cloudflare Worker /auth，授权后回跳 /admin/#token=xxx） */
export const OAUTH_ENTRY = 'https://auth.1375744701.workers.dev/auth';

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;

/** 目录接口返回的单文件条目（只取后台需要的字段） */
export interface PostFileEntry {
  /** 文件名，如 my-post.md */
  name: string;
  /** 仓库内完整路径，如 content/posts/my-post.md */
  path: string;
  /** 文件当前版本的 sha —— 更新内容时必须携带，防止覆盖他人提交 */
  sha: string;
}

/** 保存结果 */
export interface SaveResult {
  /** 本次提交产生的文件新 sha（下轮编辑要用它做乐观锁） */
  sha: string;
  commitUrl: string;
}

/**
 * 列出全部文章文件（过滤规则与 src/lib/posts.ts 一致：.md 结尾且不以 _ 开头）
 * @param token GitHub 访问令牌
 */
export async function listPosts(token: string): Promise<PostFileEntry[]> {
  const res = await fetch(`${API_BASE}/contents/${POSTS_DIR}?ref=${BRANCH}`, {
    headers: authHeaders(token),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`获取文章列表失败 (${res.status})`);
  const list = (await res.json()) as Array<{ type: string; name: string; path: string; sha: string }>;
  return list
    .filter(e => e.type === 'file' && e.name.endsWith('.md') && !e.name.startsWith('_'))
    .map(({ name, path, sha }) => ({ name, path, sha }));
}

/**
 * 读取单篇文章的原文（frontmatter + markdown 正文）
 * GitHub 返回 base64 编码且含换行；中文需经 UTF-8 字节解码，直接 atob 会乱码。
 */
export async function getPost(token: string, path: string): Promise<string> {
  const res = await fetch(`${API_BASE}/contents/${path}?ref=${BRANCH}`, {
    headers: authHeaders(token),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`读取文章失败 (${res.status})`);
  const data = (await res.json()) as { content?: string };
  const b64 = (data.content ?? '').replace(/\n/g, '');
  // base64 → 二进制字符串 → UTF-8 字节 → 正确解码中文
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * 新建或更新一篇文章（PUT Contents API）
 * @param opts.path      仓库内路径（新建时由调用方拼 content/posts/{slug}.md）
 * @param opts.sha       已存在文件的 sha（更新必填；新建传 undefined）
 * @param opts.content   完整 md 文本
 * @param opts.message   提交信息
 * 提交落库即触发云端构建剧本。
 */
export async function savePost(
  token: string,
  opts: { path: string; sha?: string; content: string; message: string }
): Promise<SaveResult> {
  const body: Record<string, unknown> = {
    message: opts.message,
    content: utf8ToBase64(opts.content),
    branch: BRANCH,
  };
  if (opts.sha) body.sha = opts.sha; // 更新已有文件必须带 sha 做版本校验

  const res = await fetch(`${API_BASE}/contents/${opts.path}`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 409) throw new Error('文章已被其他人修改过（sha 冲突），请刷新列表后再试');
    throw new Error(`保存失败 (${res.status}): ${errText.slice(0, 200)}`);
  }
  const data = (await res.json()) as { content: { sha: string }; commit: { html_url: string } };
  return { sha: data.content.sha, commitUrl: data.commit.html_url };
}

/** 统一的认证请求头 */
function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' };
}

/** 中文安全编码：字符串 → UTF-8 字节 → base64（直接 btoa(中文) 会抛错或乱码） */
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
