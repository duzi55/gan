# 灵感生成与展示规则（内部功能规范）

> 2026-08-28 Claude·固化灵感系统的生成流程 / 展示结构 / 样式隔离 / 性能与双端要求。
> **定位：仅为本项目内部功能约定，严禁移入博客文章或对外文档。**
> 存储位置：`src/components/inspiration/INSPIRATION_RULES.md`（与 registry 同目录，代码注释以「见 INSPIRATION_RULES.md」方式引用）。
> 任何未来新增灵感功能，开工前必须先通读本文件并逐条遵守。

---

## 一、内容生成流程（四步，顺序固定）

1. **精确复刻原型**：先 1:1 复刻灵感原始组件（对照原文链接 / 图片资源），不带主观改动。
2. **衍生变体（≥ 2 个）**：基于原型衍生设计多个变体组件，每个变体保留原型的视觉语言（玻璃体 / 液态渐变 / 噪点），只改形态或交互场景。
3. **原型整屏展示**：详情页 Hero 舞台高 100svh，原型组件独占整个视窗居中展示。
4. **滚动依次显示**：向下滚动依次出现「原文溯源卡 → 各衍生变体（标注行 + 舞台块）」，用 `Reveal` 渐进增强（IntersectionObserver 单次触发，SSR / 无 JS / reduced-motion 直接可见）。

## 二、溯源规则（强制）

- 每个灵感条目必须在 `registry.ts` 登记 `source` 字段：`label` / `url` 必填，`via` / `image` 至少其一。
- 原文链接在详情页「原文」区块展示并 `target="_blank"` 外跳；列表页仅以统计落款体现来源方，不展示链接。
- 严禁无来源登记新条目（不可溯源 = 不可上架）。

## 三、展示结构规范（详情页三幕式）

| 幕 | 内容 | 容器 | 风格 |
| --- | --- | --- | --- |
| 第一幕 | 原型独占 100svh | hero `<section>`（深空舞台） | stage 深空底 + lg-noise + 双 lg-blob + 白色 mono 标注 |
| 第二幕 | 原文溯源卡 | GlassCard（宣纸风） | 系统 token：ink-eyebrow / ink-underline / border |
| 第三幕 | 变体依次显现 | 标注行 + `rounded-3xl` 深空舞台块 | 同第一幕语言，光斑按 `BLOB_COLORS` 轮换 |

- 列表页**必须保持原系统宣纸风**，形态为**瀑布流卡片墙**（2026-08-28 Claude·按用户澄清固化）：
  - 每复刻一个灵感 = 新增**一张卡片**（缩略图小窗 + 宣纸风信息栏），多卡组成瀑布流；
  - 布局用纯 CSS `columns` + `break-inside-avoid`（零 JS masonry），缩略窗比例轮换制造错落；
  - 未来每次复刻新链接，只需在 registry 新增条目 + 对应组件，列表自动多一张卡（数据驱动，不改页面）。
- 深空只允许以「缩略图小窗」形式内嵌在卡片顶部；组件在列表页只出现纯 CSS 微缩图（minis，零客户端 JS），点击进入详情页才加载可交互本体。

## 四、样式隔离铁律

- 深空底（`item.stage` 渐变）、`lg-noise`、`lg-blob` **只允许出现在三类舞台容器内部**：
  1. 详情页 hero section；
  2. 详情页 `rounded-3xl` 变体舞台块；
  3. 列表卡片的微缩预览小窗。
- 舞台之外的一切版面只能使用系统体系：`text-foreground / text-muted / text-faint`、`border-border`、`ink-*` 排版类、`GlassCard`。
- `lg-*` 前缀类只定义在 `liquid-glass.css`，禁止全局选择器、禁止修改系统 `globals.css` 来服务灵感组件。
- 组件内部样式一律自包含（inline style / lg-* 类 / Tailwind 原子类），禁止向父级或兄弟溢出样式。

## 五、性能铁律

- 列表页 = Server Component + 纯 CSS 微缩图，**客户端 JS 为零**。
- 玻璃组件本体（原型 + 变体）统一经 `GlassMount` 以 `next/dynamic`（`ssr: false`）按需加载，加载键：原型 `slug`，变体 `` `${slug}:${variantId}` ``；加载态用 Skeleton 骨架占位。
- 动效只用 CSS（`lg-spin` / `lg-bob` / transition）；确需 JS 的低频任务（如时钟 1s tick）须在组件内部自持并在卸载时清理。

## 六、双端适配铁律

- 所有玻璃组件宽度一律 `min(NNNpx, 84vw)` 内联钳制，禁止固定 `w-[NNNpx]`。
- 全屏舞台高 = `className="h-screen"` + `style={{ height: '100svh' }}`（旧浏览器自动回落 h-screen）。
- 交互目标（链接 / 按钮 / 滑块 thumb）不小于约 40px 触控热区；小字链接用负 margin + padding 扩区。
- 遵守 `prefers-reduced-motion`：动画类（lg-spin / lg-bob / reveal）静态降级。

## 七、新增灵感 Checklist（照序执行）

1. 通读本文件；
2. `registry.ts` 登记：`slug / no / title / titleEn / desc / points / stage / Mini / source / variants`（变体 ≥ 2）；
3. `minis` 中补纯 CSS 微缩图（零 JS）；
4. 创建原型组件与 `variants/` 变体组件（遵守第四 / 五 / 六条铁律，头注释写明衍化思路与加载键）；
5. `GlassMount` LOADERS 补 `slug` 与全部 `` `${slug}:${id}` `` 键；
6. 详情页 / 列表页无需改动（数据驱动）；
7. `npm run build` 通过后提交。

---

*违者视为破坏系统规范：灵感内容可能不可溯源、样式可能污染系统纸面、性能与双端体验可能回退。*
