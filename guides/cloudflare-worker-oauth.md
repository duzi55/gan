# Cloudflare Worker OAuth 网关部署指南

> 2026-08-27 Claude·为「墨境」博客 /admin 在线后台编写
>
> 作用：GitHub 规定「授权码换令牌」这一步必须由服务端出示密钥，
> 本 Worker 就是替您保管 client_secret、完成最后一步交换的免费小函数。
> 它只在您点「GitHub 登录」的几秒钟内工作，平时不存在。

## 全流程一览

```
┌──────────────┐   ①跳转授权   ┌──────────────┐
│ 博客 /admin  │ ───────────→ │ GitHub 授权页 │  您点「授权」
└──────────────┘              └──────┬───────┘
       ↑                             │ ②带 code 回调
       │  ⑤token 回传给浏览器        ↓
┌──────┴──────────────────────────────┐
│ Cloudflare Worker（本指南部署的东西）│ ← secret 只存在这里
└─────────────────────────────────────┘
```

## 准备清单

| 需要什么 | 说明 |
|---|---|
| 一个邮箱 | 用于注册 Cloudflare |
| 您的博客线上地址 | 本项目为 `https://duzi55.github.io/gan/` |
| 约 10 分钟 | 全程网页点击，无需命令行 |

---

## 第 1 步：在 GitHub 创建 OAuth App

1. 打开 github.com → 右上角头像 → **Settings**
2. 左侧菜单拉到最底 → **Developer settings**
3. **OAuth Apps** → 右上角 **New OAuth App**
4. 按下表填写：

| 字段 | 填什么 |
|---|---|
| Application name | `墨境博客后台`（随意，只给自己看） |
| Homepage URL | `https://duzi55.github.io/gan/` |
| Authorization callback URL | 先填 `https://placeholder.workers.dev/callback`（第 5 步拿到真地址后回来改） |

5. 点 **Register application** → 记下页面的 **Client ID**
6. 点 **Generate a new client secret** → **立即复制保存 Client Secret**
   （此值只显示这一次，丢了只能重新生成）

## 第 2 步：注册 Cloudflare

1. 打开 `https://dash.cloudflare.com/sign-up`
2. 邮箱 + 密码注册，选择 **Free 免费计划**
3. 注册后若提示添加域名/网站，**跳过即可**（Worker 不需要绑域名）

## 第 3 步：创建 Worker 并粘贴代码

1. Cloudflare 控制台左侧 → **Workers & Pages**
2. **Create** → 选 **Worker** → 点 **Deploy**（先用默认 hello world 部署）
3. 部署完成点 **Edit code** 进入编辑器
4. **删光默认代码**，粘贴下面这份源码：

```js
/**
 * 墨境博客 OAuth 网关（Cloudflare Worker）
 * 2026-08-27 Claude·为 /admin 后台提供 GitHub「授权码 → 令牌」交换
 *
 * 需要的绑定（第 4 步配置）：
 *   变量 GITHUB_CLIENT_ID      GitHub OAuth App 的 Client ID
 *   密钥 GITHUB_CLIENT_SECRET  GitHub OAuth App 的 Client Secret
 *   变量 ALLOWED_ORIGIN        授权后允许回跳的博客源，如 https://duzi55.github.io
 *   KV   OAUTH_STATE           一次性 state 存储（防 CSRF 伪造）
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/auth') return startAuth(url, env);
    if (url.pathname === '/callback') return handleCallback(url, env);
    return new Response('Not Found', { status: 404 });
  },
};

/* 发起授权：生成一次性 state 存入 KV，再跳转 GitHub 授权页 */
async function startAuth(url, env) {
  const state = crypto.randomUUID();
  await env.OAUTH_STATE.put(state, '1', { expirationTtl: 600 }); // 10 分钟有效
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', `${url.origin}/callback`);
  // 公开仓库用 public_repo（最小权限）；若仓库改为私有需换成 repo
  authorize.searchParams.set('scope', 'public_repo');
  authorize.searchParams.set('state', state);
  return Response.redirect(authorize.toString(), 302);
}

/* 接收回调：校验 state → 换取 token → 通过 URL fragment 回传博客 /admin */
async function handleCallback(url, env) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const valid = state && (await env.OAUTH_STATE.get(state));
  if (!code || !valid) return new Response('非法授权请求', { status: 400 });
  await env.OAUTH_STATE.delete(state); // state 一次性，用后即焚

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/callback`,
    }),
  });
  const data = await tokenRes.json();
  if (!data.access_token) {
    return new Response('授权失败: ' + (data.error_description || '未知错误'), { status: 401 });
  }

  // fragment（# 号后）不会进服务器日志与浏览器历史记录
  const back = new URL(env.ALLOWED_ORIGIN + '/admin/');
  back.hash = 'token=' + data.access_token;
  return Response.redirect(back.toString(), 302);
}
```

5. 右上角 **Deploy** 保存部署

## 第 4 步：配置密钥变量与 KV 存储

Worker 详情页 → **Settings** → **Variables and Secrets**：

| 类型 | 名称 | 值 |
|---|---|---|
| Text | `GITHUB_CLIENT_ID` | 第 1 步拿到的 Client ID |
| Secret | `GITHUB_CLIENT_SECRET` | 第 1 步保存的 Client Secret |
| Text | `ALLOWED_ORIGIN` | `https://duzi55.github.io` |

再创建 KV 存储并绑定（防伪造授权）：

1. 左侧 **Storage & Databases** → **KV** → **Create namespace**，名字随意（如 `mojing-oauth`）
2. 回到 Worker → **Settings** → **Bindings** → **Add** → 选 **KV namespace**
   - Variable name 填 `OAUTH_STATE`（必须一字不差）
   - 选择刚创建的命名空间 → 部署生效

## 第 5 步：回填真实回调地址

1. Worker 部署页顶部能看到您的网址，形如 `https://mojing-oauth.你的子域.workers.dev`
2. 回到 GitHub → Settings → Developer settings → OAuth Apps
3. 把 Authorization callback URL 改为：

```
https://mojing-oauth.你的子域.workers.dev/callback
```

4. **Update application** 保存

## 第 6 步：验收测试

浏览器直接访问：

```
https://mojing-oauth.你的子域.workers.dev/auth
```

预期表现：

1. 跳到 GitHub 授权页，显示「墨境博客后台」请求权限
2. 点 **Authorize** 后地址栏跳回 `https://duzi55.github.io/admin/#token=...`
   （现在 /admin 页面还没建，404 是正常的，只要看到 `#token=` 就说明网关已通）

---

## 常见问题

**Q：redirect_uri_mismatch 报错？**
第 5 步的回调地址必须与 Worker 实际网址完全一致（含 `https://`、不含末尾多余斜杠）。

**Q：换 Cloudflare 子域名了？**
同步修改 GitHub OAuth App 的 callback URL 即可，其余不动。

**Q：token 会过期吗？**
OAuth 用户令牌长期有效，除非您在 GitHub → Settings → Applications → Authorized OAuth Apps 里手动撤销。

**Q：别人能用我的网关拿 token 吗？**
不能。token 只发给「在 GitHub 登录并授权的自己」，别人授权拿到的也是他自己账号的 token，而他无权写您的仓库。`ALLOWED_ORIGIN` 限定了 token 只回传到您的博客域名。

## 安全设计说明

- `client_secret` 仅存在 Cloudflare 环境变量（加密存储），前端永远接触不到
- `state` 一次性 + 10 分钟过期，防跨站伪造授权
- token 通过 URL fragment（`#` 后）回传，不进服务器日志
- `ALLOWED_ORIGIN` 白名单限定回跳目标，防开放重定向
