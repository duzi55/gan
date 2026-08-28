---
title: '一轮迭代里的八个坑：从 YAML 类型陷阱到滚动掉帧'
date: '2026-08-28'
excerpt: 把这轮博客迭代的翻车现场全部摊开——CI 报错、Actions 不触发、滚动卡顿、rebase 冲突，每个坑都附根因与修复，供人与 AI 共同引用
tags:
  - 架构
  - Web
gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
accent: '#b3432b'
---

这篇文章是一次「翻车实录」。墨境刚结束一轮迭代：修 CI、修卡顿、改代码框、换画廊。过程中踩了八个坑，每个都算不上高深，但都足够典型——事后我把根因和修复全部记录在案，一来给未来的自己，二来给未来协助开发的 AI：**错误信息是路标，别绕开它，顺着走**。

## 坑一：TypeError: c.title.charAt is not a function

CI 日志里最刺眼的一行：

```text
TypeError: c.title.charAt is not a function
Export encountered an error on /posts/11
```

根因不在 JS，在 YAML。我在后台发了一篇标题为《666》的文章，序列化 frontmatter 时纯数字没加引号，gray-matter 按照 YAML 规范把它解析成了 `number`。渲染层调 `.charAt()`，数字没有这个方法，构建当场爆炸。

修复是釜底抽薪：序列化函数对所有字段统一加引号，内部单引号双写转义：

```ts
function yamlQuote(s: string): string {
  return `'${String(s).replace(/'/g, "''")}'`;
}
```

**教训**：凡是要经过 YAML 中转的字符串，出口处一律加引号，不要信任「用户大概会输入正常文本」。

## 坑二：Actions 为什么不触发

两个现象叠加造成的误会：推送 workflow 文件的那次 push 不触发自身（GitHub 规则）；真正触发构建的是后台保存文章那一次，但它挂在构建步骤上。另外本站的云端回写 docs 用 `GITHUB_TOKEN` 推送，按规则不会再触发一次 workflow，配合 commit message 里的 `[skip ci]`，构成双保险，防止「构建→提交→再构建」的死循环。

**教训**：判断「为什么没触发」之前，先分清三件事——push 不触发自身、token 推送不触发、`[skip ci]` 显式跳过。三者都是设计，不是故障。

## 坑三：滚动卡顿的三元凶

「浏览文章偶尔掉帧」，排查出三个叠加来源：

1. **WebGL 不睡觉**。three.js 墨尘粒子场滚出视口后仍在每帧渲染，白白抢占 GPU。修复：IntersectionObserver 监听容器，滚出视口（留 100px 余量）就暂停渲染循环，回来再恢复；
2. **scroll 里强制重排**。目录高亮组件每次 scroll 都对每个标题调 `getBoundingClientRect()`，一帧内十几次同步布局。修复：挂载时测量一次缓存文档偏移，resize 才重测；scroll 回调里直接和缓存比较；
3. **每帧 setState**。阅读进度条把连续小数灌进 React，一帧一次重渲染。修复：rAF 节流合并同帧事件，进度离散化到整数百分比才更新。

**教训**：滚动性能三板斧——`requestAnimationFrame` 节流、布局位置静态缓存、setState 离散化。三条一起上，掉帧才真的消失。

## 坑四：className 里写注释

给代码块加 terminal 样式时，我把「修改时间·功能」注释顺手写进了模板字符串里——Tailwind 把它当成一个类名，静默忽略，不报错。注释必须写在 JSX 注释区，类名字符串里只能有类。

**教训**：模板字符串里的任何非类名内容都是隐患，而且这种错不报错，只能靠肉眼。

## 坑五：terminal 三灯的正确画法

正文代码块要黑色终端风。mac 三灯如果老老实实画三个 `<span>`，得侵入 HTML 生成层；其实一个伪元素加 box-shadow 就够：

```css
pre::before {
  content: '';
  position: absolute; left: 20px; top: 18px;
  width: 12px; height: 12px; border-radius: 50%;
  background: #ff5f56;                         /* 红灯本体 */
  box-shadow: 14px 0 0 #ffbd2e, 28px 0 0 #27c93f; /* 黄灯绿灯偏移 */
}
```

配合 `[&_pre]` 系列 Tailwind 任意值类挂在正文容器上，纯 CSS，零 JS。

## 坑六：PowerShell 里没有 heredoc

提交长 commit message 时照搬 Bash 的 `git commit -m "$(cat <<'EOF' ... EOF)"`，PowerShell 直接语法错误。它的对应物是 here-string：

```powershell
$msg = @'
多行提交说明
'@; git commit -m $msg
```

**教训**：shell 惯用法不能跨 shell 搬运，尤其是引号和重定向。

## 坑七：docs 构建产物的 rebase 冲突

本地提交晚于云端 bot 的 docs 回写，`pull --rebase` 又因工作区脏而失败，推送被拒；强行 rebase 后在 docs 的哈希 chunk 文件上炸出一堆 add/add、delete/delete 冲突。最终解法干净利落：

```text
git rebase --abort        ← 放弃纠缠
git fetch origin
git reset --soft origin/main   ← 分支指到远端，工作区保持本次新构建
git add docs src public
git commit && git push
```

构建产物没有「合并」的价值，只有「以最新一次构建为准」这一种正确状态。

**教训**：对生成物目录（docs、dist、out）永远不要做精细合并，软重置后整体覆盖提交。

## 坑八：AI 生成图的格式校验

画廊的八幅水墨图由文生图 API 生成，落盘前逐张验文件头：`FF D8 FF` 才是 JPEG，扩展名 `.jpg` 本身不可信。八张全部校验通过再入库，总重约 1.7MB，单张 160–265KB。

**教训**：外部来源的二进制，入库前用魔数校验真实格式，这是对下载行为最基本的确认。

## 给未来 AI（和人）的清单

- YAML 出口全字段加引号，不信任输入类型
- scroll 监听三件套：rAF 节流 / 静态缓存 / 离散化 setState
- 视口外的 WebGL 必须暂停，IntersectionObserver + rootMargin 留余量
- Tailwind 任意值伪元素 + box-shadow 可以画出很讲究的 UI，不进 HTML 生成层
- 构建产物冲突：`reset --soft` 到远端后整体覆盖，绝不精细合并
- 二进制入库前验魔数；跨 shell 的脚本语法要重写而不是翻译

这一轮迭代的所有改动都已随站点上线。坑常踩常新，记下来，下次绕行。
