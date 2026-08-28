---
title: '站长报障实录：一个博客的七次提问与七次修复'
date: '2026-08-28'
excerpt: 从「Actions 怎么没触发」到「控制台一堆报错」——把站长报过的每个问题按 原话→探讨→方案→避坑 记录在案，供人与 AI 对照引用
tags:
  - 架构
  - Web
gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
accent: '#b3432b'
---

墨境上线后的这几轮迭代，全部由站长的报障和提问驱动。这篇文章换个写法：**按问题组织**，每个问题还原四段——站长原话、探讨（当时怎么想的）、解决方案、避坑要点。给未来的自己，也给未来协助排障的 AI：报障原话是第一现场，别急着改代码，先顺着原话走一遍。

## 问题一：「没有触发啊，你是不是搞错了」

**探讨**：站长推送 workflow 文件后盯着 Actions 页等了半天。其实这里叠了三层规则：推送 workflow 的那次 push 不触发它自身（GitHub 设计）；真正触发构建的是后台保存文章那一次；云端回写 docs 用 `GITHUB_TOKEN` 推送，按规则不再触发 workflow，配合 `[skip ci]` 双保险，防止「构建→提交→再构建」死循环。

**方案**：不改代码，改认知。判断「为什么没触发」前先分清：push 不触发自身、token 推送不触发、`[skip ci]` 显式跳过——三者都是设计不是故障。

**避坑**：CI 排障先画触发链路图，再谈「是不是搞错了」。

## 问题二：CI 报错 `TypeError: c.title.charAt is not a function`

**探讨**：站长贴来完整日志，报错落在 `/posts/11`——正是他后台发的《666》。根因在 YAML：序列化 frontmatter 时纯数字标题没加引号，gray-matter 按 YAML 规范解析成 `number`，渲染层 `.charAt()` 当场爆炸。**错误信息里的方法名是路标**：「charAt 不是函数」= 有个该是字符串的东西不是字符串。

**方案**：序列化函数全字段加引号，内部单引号双写转义：

```ts
function yamlQuote(s: string): string {
  return `'${String(s).replace(/'/g, "''")}'`;
}
```

**避坑**：凡经 YAML 中转的字符串，出口一律加引号；不要信任「用户大概会输入正常文本」。

## 问题三：「我在国内授权网站跳转不过去啊」

**探讨**：GitHub OAuth 授权页（github.com）、`api.github.com`、Workers 网关（workers.dev）在国内网络三重受阻。手机端没有代理环境时这是死结，不是代码问题。

**方案**：两条路——自定义域名 + Worker 反代（彻底绕开被墙域），或设备装代理。站长选择「算了」，此题挂起待办。

**避坑**：涉及 GitHub 全家桶的功能，先确认目标用户的网络可达性，再写代码。

## 问题四：「有没有免费图床？建个仓库存图会不会加载更快？」

**探讨**：直觉是「把图片挪出去=给主站减负」，实际上另开仓库反而更慢：独立仓库的图片走 `raw.githubusercontent.com`（国内污染严重）或 jsDelivr（连通率波动），跨域握手、缓存策略还都不受控。同仓库 `public/images/posts/` 与站点同域名同 CDN，首访即随站点缓存。

**方案**：图片放本项目 `public/images/posts/`，配图规范落成一篇文章；画廊 8 幅图也走同一路线。

**避坑**：「图片放外面」是私有服务时代的经验；静态托管站点的最优解是图片与站点同源。

## 问题五：「浏览文章的时候滚动会很卡顿（偶尔会触发）」

**探讨**：「偶尔」说明不是渲染负担恒定，而是特定条件叠加。排查出三元凶：WebGL 墨尘滚出视口仍每帧渲染（GPU 抢占）；目录组件每次 scroll 循环调 `getBoundingClientRect`（强制同步布局）；阅读进度条每帧 setState（React 重渲染）。

**方案**：滚动性能三板斧——

```ts
// 1. rAF 节流：一帧内多次 scroll 合并为一次计算
function onScroll() {
  if (raf) return;
  raf = requestAnimationFrame(() => { raf = 0; /* 计算+更新 */ });
}
// 2. 布局位置静态缓存：挂载时测一次，scroll 只比对缓存
// 3. setState 离散化：整数百分比变化才更新
```

外加 IntersectionObserver 让 WebGL 滚出视口即暂停、回滚前 100px 提前唤醒。

**避坑**：scroll 回调里禁止出现任何会触发重排的 API；「偶尔卡顿」多半是多个每帧开销的叠加，逐个消掉。

## 问题六：「代码想放进黑色 terminal 框」「画廊用外链？但我不知道放什么图」

**探讨**：前者纯 CSS：`pre::before` 一个伪元素，`box-shadow: 14px 0 0 #ffbd2e, 28px 0 0 #27c93f` 一次画出 mac 三灯，零 JS、不侵入 HTML 生成层。后者是「选题」问题而非「技术」问题——站长真正需要的不是外链，是**风格统一的图源**。最终用文生图 API 产出「纸上山水」八幅（与宣纸美学同宗），入库 `public/images/gallery/`，逐张验文件头 `FF D8 FF` 才收货。

**避坑**：外部来源的二进制入库前验魔数；画廊这类「内容无解」的需求，先解决风格统一，加载速度自然随之解决。

## 问题七：「Pages 网站控制台一堆报错」（最新一案）

站长贴来三组控制台信息，逐个过堂：

**① `TypeError: t[Symbol.asyncIterator] is not a function`（Uncaught in promise）**

探讨：先在构建产物里按 chunk 哈希定位报错函数，上下文全是 `STATIC_STALETIME_MS`、`segmentCacheMap`、`createFromNextReadableStream`——**不在业务代码里，是 Next 16 Segment Cache（路由预取缓存）的内部实现**。再排除法：预取产物 `.txt` 在服务端齐全、路径扁平化无误，那 `t` 为什么不可迭代？答案：`t` 是 RSC 响应流，Next 直接调 `stream[Symbol.asyncIterator]()`——这是 ReadableStream 的**异步迭代协议方法**，Chrome 124 / Safari 17.4 才原生支持。老内核浏览器（以及大量国产壳浏览器）没有它，预取必炸。

方案：根布局 `<head>` 里塞一段按 W3C Streams 规范写的 polyfill，现代浏览器命中卫语句直接跳过，零副作用：

```js
if (typeof ReadableStream !== "undefined"
    && !ReadableStream.prototype[Symbol.asyncIterator]) {
  ReadableStream.prototype[Symbol.asyncIterator] = function () {
    var r = this.getReader();
    return { next: () => r.read(), /* return/throw 略 */ };
  };
}
```

避坑：**「Symbol.asyncIterator is not a function」出现在处理流/响应的库代码里，第一嫌疑是浏览器内核版本，不是数据结构写错了**。线上报障先问浏览器型号。

**② 图片 preload 警告**（`g-shanshui.jpg was preloaded but not used`）

探讨：业务代码没有任何 preload 调用。真凶是 React 19 的预取语义：路由预取 /gallery 的 RSC 载荷时，载荷里的图片被顺带 `preload` 进请求队列；站长没点进画廊，浏览器几秒后提醒「预加载没用上」。这是预取机制的副作用，无害。

**③ `Cannot read properties of undefined (reading 'startTime')`**

探讨：调用栈在 `reportAllChanges` / `requestIdleCallback`——Next 内置的 web-vitals（INP 指标）上报代码，是上游库在指标条目缺失时的已知边角问题，与站点代码无关，可安全忽略。

避坑：控制台报错要「分诊」——业务错误必须修，框架内部错误查 issue，浏览器提示性警告看一眼即可。全都要「清零」是强迫症，不是工程。

## 给未来 AI 的分诊清单

- CI 报错先看**方法名**：`charAt/replace is not a function` = 类型混入，查 YAML/JSON 序列化出口
- 「没触发」先查触发规则（自身 push 不触发、token 不触发、`[skip ci]`）
- 滚动卡顿三板斧：rAF 节流、布局缓存、离散化 setState；视口外 WebGL 必须暂停
- 压缩产物排障：按 chunk 哈希找文件，搜报错符号上下文里的常量名反查框架模块
- `Symbol.asyncIterator` 报错 = 老内核浏览器，head 里补 polyfill
- 静态站图片与站点同源；二进制入库前验魔数
- 构建产物冲突不合并，`reset --soft` 到远端后整体覆盖提交

七问七答，全部闭环。报障不怕多，怕的是记不下来。
