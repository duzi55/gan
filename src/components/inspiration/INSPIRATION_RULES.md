# 灵感生成与展示规则（内部功能规范）

> 2026-08-28 Claude·固化灵感系统的数据模型 / 生成流程 / 展示结构 / 样式隔离 / 性能与双端要求。
> **定位：仅为本项目内部功能约定，严禁移入博客文章或对外文档。**
> 存储位置：`src/components/inspiration/INSPIRATION_RULES.md`（与 registry 同目录，代码注释以「见 INSPIRATION_RULES.md」方式引用）。
> 任何未来新增灵感功能，开工前必须先通读本文件并逐条遵守。

---

## 〇、数据模型（两级结构，先读这条）

```
InspirationEntry（灵感 = 一次复刻来源 = 列表一张卡）
 ├─ source          唯一来源（必填，见第二节；url 自 2026-08-31 起可选）
 ├─ immersive?      沉浸式开关（可选，见第三节「首屏净化」；IN-02 起支持）
 ├─ coverStage / coverMini  列表卡缩略窗（深空底 + 纯 CSS 微缩图）
 └─ prototypes[]    该灵感下 1:1 复刻的原型（≥1 件，详情页每件独占一整屏）
      ├─ slug       GlassMount 原型加载键（与灵感路由 slug 相互独立）
      ├─ stage      舞台底（仅限舞台容器使用，见第四节；可为深空或粉彩等浅色渐变）
      ├─ Mini       纯 CSS 微缩图（零客户端 JS）
      └─ variants[] 衍生变体（≥2 个，键 `${slug}:${id}`）
```

- **灵感粒度 = 链接来源**：同一来源下复刻再多组件，列表仍然只有一张卡；
  以后每复刻一个新链接，`INSPIRATIONS` 新增一个 Entry，列表自动多一张卡。
- 详情页路由 `/inspiration/[slug]` 用**灵感 slug**（如 `liquid-glass`），
  一页收纳该灵感全部原型与变体（文章式叙事）。

## 一、内容生成流程（四步，顺序固定）

1. **精确复刻原型**：先 1:1 复刻灵感原始组件（对照原文链接 / 图片资源），不带主观改动；同一灵感可复刻多件原型，全部登记进同一 Entry 的 `prototypes`。
2. **衍生变体（每件原型 ≥ 2 个）**：基于原型衍生设计多个变体组件，每个变体保留原型的视觉语言（玻璃体 / 液态渐变 / 噪点），只改形态或交互场景。
   - **例外（2026-08-31 Claude·用户裁定，IN-04 治愈画卷起）**：图片画廊类灵感
     （内容为整组图片的沉浸式浏览）不做衍生，`variants` 登记为空数组；
     详情页衍生幕按 `totalVariants === 0` 整节隐藏、原文幕序号收为 01。
3. **原型整屏展示**：详情页每件原型各独占一整屏舞台（`100svh`），组件居中、独占整个视窗。
4. **滚动依次显示**：详情页按「序幕（灵感题头 + 首件原型）→ 其余原型整屏幕 → 衍生变体依次显现 → 原文溯源卡」的文章式顺序展开；变体用 `Reveal` 渐进增强（IntersectionObserver 单次触发，SSR / 无 JS / reduced-motion 直接可见）。

## 二、溯源规则（强制）

- 每个**灵感 Entry** 必须登记 `source` 字段：`label` 必填，`via` / `image` 至少其一。
- **url 可选化（2026-08-31 Claude·IN-02 起）**：`source.url` 允许缺省——
  「用户提供设计图」这类无公开原链接的灵感，登记来源身份（label / via 说明）即可，
  **严禁为凑溯源而编造 URL**；详情页原文幕对 url 做条件渲染，
  无 url 时以文字说明「来源身份见 via 标注」，不渲染 `<a>` 外跳。
- 有 url 时，原文链接在详情页「原文」区块展示并 `target="_blank"` 外跳；列表页仅以统计落款体现来源方，不展示链接。
- 严禁无来源登记新条目（不可溯源 = 不可上架）。

## 三、展示结构规范

| 幕 | 内容 | 容器 | 风格 |
| --- | --- | --- | --- |
| 序幕 | 灵感题头 + 首件原型独占 100svh | hero `<section>`（深空舞台） | stage 深空底 + lg-noise + 双 lg-blob + 白色 mono/display 排版 |
| 原型幕 2..N | 其余原型各独占 100svh | 同上（深空舞台） | 同序幕语言，标注 `Prototype i/N` |
| 衍生幕 | 全部变体扁平 V1…Vn 依次显现 | 标注行 + `rounded-3xl` 深空舞台块 | 宣纸风标注（ink-index / ink-display / 所属原型 tag）+ 舞台块 |
| 原文幕 | 溯源卡（来源 / 外跳 / via / 日期） | GlassCard（宣纸风） | 系统 token |

- **首屏净化（immersive，2026-08-31 Claude·用户规范，IN-02 起生效）**：
  Entry 可声明 `immersive: true`，此时详情页**首个视图只渲染「复刻本体 + 返回键」**——
  灵感题头、要点 chips、titleEn / 编号水印、底部 Prototype 标注、StageNextButton 步进
  与右侧 StageRail 屏点导航**全部不进首屏**（设计理念等元信息后续幕照常展示）；
  返回键配色须按舞台明暗适配：浅色粉彩舞台用深色文字（如 `text-neutral-700`），
  深空舞台沿用白色 mono；序幕光斑在浅色舞台下换同色系粉彩（保持样式隔离铁律）。
  未声明 `immersive` 的灵感维持原序幕排版不变（IN-01 等）。
- 列表页**必须保持原系统宣纸风**，形态为**瀑布流卡片墙**：
  - 一次灵感 = **一张卡片**（缩略图小窗 + 宣纸风信息栏 + 原型/变体/日期统计 chips），
    点进详情才展示具体内容，多卡组成瀑布流；
  - 布局用纯 CSS `columns` + `break-inside-avoid`（零 JS masonry），缩略窗比例轮换制造错落；
  - 未来每次复刻新链接，只需在 registry 新增一个 Entry + 对应组件，列表自动多一张卡（数据驱动，不改页面）。
- 深空只允许以「缩略图小窗」形式内嵌在卡片顶部；组件在列表页只出现纯 CSS 微缩图（minis，零客户端 JS），点击进入详情页才加载可交互本体。
- **滚动行为（2026-08-28 Claude·固化 v3 方案）**：整屏舞台的吸附由 `SnapController` JS 控制器实现，
  **禁用 CSS `scroll-snap-type`**（proximity 桌面滚轮无感；mandatory 卡死末屏、打断停留）——
  滚动停止后仅当残留 ≤20%（阈值常量 `SNAP_THRESHOLD` 可调）才吸附最近整屏，
  中间地带停留权归用户，滚入衍生/原文纸面区后永不干预；
  辅助导航：舞台底部 `StageNextButton`（点击直达下一视图）+ 右侧 `StageRail`（屏点导航/当前屏高亮）
  + 顶部 `ReadingProgress`（全文进度条）；三者与控制器一样只认 `data-snap-stage` / `data-snap-next` 标记。

## 四、样式隔离铁律

- 深空底（stage 渐变）、`lg-noise`、`lg-blob` **只允许出现在三类舞台容器内部**：
  1. 详情页整屏原型 section（序幕 + 原型幕）；
  2. 详情页 `rounded-3xl` 变体舞台块；
  3. 列表卡片的微缩预览小窗。
- 舞台之外的一切版面只能使用系统体系：`text-foreground / text-muted / text-faint`、`border-border`、`ink-*` 排版类、`GlassCard`。
- `lg-*` 前缀类只定义在 `liquid-glass.css`，禁止全局选择器、禁止修改系统 `globals.css` 来服务灵感组件。
- 组件内部样式一律自包含（inline style / lg-* 类 / Tailwind 原子类），禁止向父级或兄弟溢出样式。

## 五、性能铁律

- 列表页与首页微缩图 = Server Component + 纯 CSS，**客户端 JS 为零**。
- 玻璃组件本体（原型 + 变体）统一经 `GlassMount` 以 `next/dynamic`（`ssr: false`）按需加载，加载键：原型 `slug`，变体 `` `${slug}:${variantId}` ``（均为**原型 slug**，与灵感路由无关）；加载态用 Skeleton 骨架占位。
- 动效只用 CSS（`lg-spin` / `lg-bob` / transition）；确需 JS 的低频任务（如时钟 1s tick）须在组件内部自持并在卸载时清理。

## 六、双端适配铁律

- 所有玻璃组件宽度一律 `min(NNNpx, 84vw)` 内联钳制，禁止固定 `w-[NNNpx]`。
- 全屏舞台高 = `className="h-screen"` + `style={{ height: '100svh' }}`（旧浏览器自动回落 h-screen）。
- 交互目标（链接 / 按钮 / 滑块 thumb）不小于约 40px 触控热区；小字链接用负 margin + padding 扩区。
- 遵守 `prefers-reduced-motion`：动画类（lg-spin / lg-bob / reveal）静态降级。

## 七、新增内容 Checklist（照序执行）

**新增一个灵感（新链接复刻）**：
1. 通读本文件；
2. `registry.ts` 新增一个 Entry：`slug / no / title / titleEn / desc / date / source / coverStage / coverMini / prototypes`；
   首屏需「只留复刻 + 返回键」时追加 `immersive: true`（见第三节首屏净化）；
3. 逐件复刻原型并衍生变体（每件原型走下方「新增原型」流程）；
4. 列表 / 详情页无需改动（数据驱动），`npm run build` 通过后提交。

**在既有灵感下新增一件原型**：
1. `registry.ts` 对应 Entry 的 `prototypes` 追加一件（含 `variants ≥ 2`）；
2. `minis` 中补纯 CSS 微缩图（零 JS）；
3. 创建原型组件与 `variants/` 变体组件（遵守第四 / 五 / 六条铁律，头注释写明衍化思路与加载键）；
4. `GlassMount` LOADERS 补 `slug` 与全部 `` `${slug}:${id}` `` 键；
5. `npm run build` 通过后提交。

---

*违者视为破坏系统规范：灵感内容可能不可溯源、样式可能污染系统纸面、性能与双端体验可能回退。*
