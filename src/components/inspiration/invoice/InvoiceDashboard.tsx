/**
 * InvoiceDashboard —— IN-02「柔性账单」原型 · 发票工作台整版复刻（二版）
 * 2026-08-31 Claude·二版重做（应用户反馈「与原图相差甚远」，对照原图逐区域 1:1）：
 *   - 面板：粉彩渐变即面板本体（PANEL_GRADIENT 直铺），外圈黑色粗边框
 *     （iPad 机身感），废弃旧版「白玻璃大卡浮在渐变上」的结构；
 *   - 顶栏：sf. 黑粗字 logo → ⋮⋮ / ← 白圆钮 → 白色 Invoice 标题 →
 *     Issue Credit / Edit / Delete 图标胶囊 → 真人头像 → 搜索圆钮；
 *   - 金额行：左侧描边圆 receipt 图标 + `$ 68,575 .00` 分级排版；右侧三组
 *     「描边圆图标 + 上灰标签下黑值」元信息（Account / Invoice Number / Status）；
 *   - 进度行（同一行）：Paid / Credits / Balance 灰标签上置 + 彩色胶囊 +
 *     竖条纹纹理段（STRIPE_FILL）+ Days Outstanding 白描边胶囊 + Pay Invoice 黑胶囊；
 *   - 主体两列：左 = Invoice lines 白色大卡（67 Items 工具行含下划线搜索框 /
 *     图左文右商品卡 / 底部「大数字 Qty + Store 2 + ⋯」区）+ Details / Docs / Notes
 *     外挂浅胶囊；右 = Activity 白卡（⊕ 圆钮排 + 12 Activities + Upcoming +
 *     紫 / 黄事件卡：左上日期时间、左下真人头像、右侧居中 ✎ 白圆钮）；
 *   - 铁律不变：宽度 min(1000px, 84vw) 钳制；字体栈自包含 IV_FONT；
 *     纯静态 JSX 零状态零 hooks（详情页经 GlassMount dynamic ssr:false 加载）；
 *     头像 / 商品图为站方约定文生图 API 直链（<img> 原生标签，项目 images.unoptimized）。
 * 2026-08-31 Claude·新增（首版）：布局与数据约定见 invoiceShared.ts 头注释。
 * 2026-08-31 Claude·移动端适配（应用户反馈「移动端适配很糟糕」）：
 *   - 顶栏操作胶囊窄屏仅留图标（文字 sm 起展示）；
 *   - 金额分级字号下限 2.6rem → 2.2rem；元信息组间距收紧；
 *   - 进度行竖条纹段窄屏隐藏（避免独占整行拉高面板）；
 *   - Invoice lines 外挂标签胶囊列窄屏改「卡下方横排」，md 起恢复侧挂。
 * 加载键：'invoice-dashboard'（见 GlassMount LOADERS）。
 */

import type { ReactNode } from 'react';
import {
  BILL,
  BILL_ACTIONS,
  IV_COLOR,
  IV_FONT,
  PANEL_GRADIENT,
  STRIPE_FILL,
  TOPBAR_AVATAR,
} from './invoiceShared';

/* 金额拆分：'$68,575.00' → 整数部分 68,575 / 小数部分 00（分级排版用，不自创数字） */
const [TOTAL_INT, TOTAL_DEC] = BILL.total.replace('$', '').split('.');

/* ───────────────────────── 通用小件 ───────────────────────── */

/** 白色小圆钮：顶栏 ⋮ / ← / 搜索等共用外观（hover 微亮，纯 CSS） */
function CircleBtn({ label, size = 32, children }: { label: string; size?: number; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm transition-colors duration-200 hover:bg-zinc-50"
      style={{ width: size, height: size }}
    >
      {children}
    </button>
  );
}

/** 描边圆图标（金额行 receipt 大圆 / 元信息三组小圆共用外观：透明底 + 黑描边） */
function RingIcon({ size = 36, children }: { size?: number; children: ReactNode }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full border border-black/15 text-zinc-600"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {children}
    </span>
  );
}

/* ───────────────────────── SVG 图标（1:1 对照原图各钮位） ───────────────────────── */

/** ⋮⋮ 六点拖拽把手（顶栏第一颗圆钮） */
function GripGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {[5, 12, 19].flatMap((y) => [9, 15].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" />))}
    </svg>
  );
}

/** 操作胶囊图标：Issue Credit 票券 / Edit 铅笔 / Delete 垃圾桶（按文案映射） */
function ActionGlyph({ text }: { text: string }) {
  const common = {
    width: 13,
    height: 13,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (text === 'Issue Credit') {
    return (
      <svg {...common}>
        <path d="M2 9a3 3 0 0 0 0 6v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-3a3 3 0 0 1 0-6V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1Z" />
        <path d="M13 5v2M13 11v2M13 17v2" />
      </svg>
    );
  }
  if (text === 'Edit') {
    return (
      <svg {...common}>
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

/** 进度胶囊图标：Paid 对勾 / Credits 星形 / Balance 圆环（按段名映射） */
function SegmentGlyph({ label }: { label: string }) {
  if (label === 'Paid') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m5 12 5 5 9-10" />
      </svg>
    );
  }
  if (label === 'Credits') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="m12 3 2.5 5.5 5.5.8-4 4 1 5.7-5-2.8-5 2.8 1-5.7-4-4 5.5-.8Z" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

/** Invoice lines 工具行三小钮图标：筛选 / 排序 / 更多 */
function ToolGlyph({ type }: { type: string }) {
  if (type === 'filter') {
    return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <path d="M3 5h18l-7 8v5l-4 2v-7Z" />
      </svg>
    );
  }
  if (type === 'sort') {
    return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 4v12m0 0-3-3m3 3 3-3M17 20V8m0 0-3 3m3-3 3 3" />
      </svg>
    );
  }
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

/* ───────────────────────── 顶栏 ───────────────────────── */

/** 顶栏：sf. logo → ⋮⋮ → ← → Invoice 白标题 → 操作胶囊 → 头像 → 搜索（对照原图顺序） */
function TopBar() {
  return (
    <header className="flex flex-wrap items-center gap-2">
      {/* sf. 黑粗文字 logo（原图为文字标志，非圆形章） */}
      <span className="mr-1.5 text-[17px] font-extrabold tracking-tight" style={{ color: IV_COLOR.ink }}>
        sf.
      </span>

      {/* ⋮⋮ 六点把手 / ← 返回：白圆钮组 */}
      <CircleBtn label="Drag handle">
        <GripGlyph />
      </CircleBtn>
      <CircleBtn label="Back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5m6 6-6-6 6-6" />
        </svg>
      </CircleBtn>

      {/* Invoice 白色标题块 */}
      <span className="ml-1 rounded-xl bg-white px-4 py-1.5 text-[13px] font-semibold shadow-sm" style={{ color: IV_COLOR.ink }}>
        Invoice
      </span>

      <span className="flex-1" />

      {/* 操作胶囊组：票券 / 铅笔 / 垃圾桶 图标 + 文案
          2026-08-31 Claude·移动端适配：窄屏仅留图标胶囊（文字 sm 起展示），
          避免 Issue Credit / Edit / Delete 三组长文案把顶栏挤成三行 */}
      {BILL_ACTIONS.map((a) => (
        <button
          key={a}
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-[12px] font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow sm:px-3.5"
        >
          <ActionGlyph text={a} />
          <span className="hidden sm:inline">{a}</span>
        </button>
      ))}

      {/* 账户真人头像（本地入库图，对照原图搜索钮左侧暖色头像） */}
      <img
        src={TOPBAR_AVATAR}
        alt={`${BILL.account} avatar`}
        loading="lazy"
        className="h-9 w-9 rounded-full object-cover ring-1 ring-black/5"
      />

      {/* 搜索白圆钮（原图在头像右侧） */}
      <CircleBtn label="Search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </CircleBtn>
    </header>
  );
}

/* ───────────────────────── 金额行 ───────────────────────── */

/** 元信息组：描边圆图标 + 上灰标签 / 下黑值（Account · Invoice Number · Status） */
function MetaGroup({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <RingIcon size={36}>{icon}</RingIcon>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{label}</span>
        <span className="mt-0.5 text-[13px] font-semibold" style={{ color: IV_COLOR.ink }}>
          {value}
        </span>
      </span>
    </div>
  );
}

/** 金额行：描边圆 receipt 图标 + $ 68,575 .00 分级大金额 + 右侧三组元信息 */
function AmountHero() {
  return (
    <div className="mt-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
      {/* 左：receipt 描边大圆 + 分级排版金额（$ 小 · 整数超大 · .00 小） */}
      <div className="flex items-center gap-4">
        <RingIcon size={54}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5L10 21l-2-1.5L6 21Z" />
            <path d="M9.5 8.5h5M9.5 12.5h5" />
          </svg>
        </RingIcon>
        <p className="flex items-baseline leading-none tracking-tight" style={{ color: IV_COLOR.ink }}>
          {/* 2026-08-31 Claude·移动端适配：金额下限 2.6rem → 2.2rem，窄屏不再顶满容器 */}
          <span className="font-medium" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.6rem)' }}>$</span>
          <span className="font-medium" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.6rem)' }}>{TOTAL_INT}</span>
          <span className="font-medium" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.6rem)' }}>.{TOTAL_DEC}</span>
        </p>
      </div>

      {/* 右：三组「描边圆图标 + 上灰标签下黑值」元信息
          2026-08-31 Claude·移动端适配：收紧行间距，窄屏掉行更整齐 */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:gap-x-7 sm:gap-y-3">
        <MetaGroup
          label="Account"
          value={BILL.account}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          }
        />
        <MetaGroup
          label="Invoice Number"
          value={BILL.invoiceNo}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
            </svg>
          }
        />
        <MetaGroup
          label="Status"
          value={BILL.status}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="m8.5 12 2.5 2.5 4.5-5" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

/* ───────────────────────── 进度行 ───────────────────────── */

/** 进度行：灰标签上置三胶囊 + 竖条纹段 + Days Outstanding 白描边胶囊 + Pay Invoice 黑胶囊 */
function ProgressRow() {
  return (
    <div className="mt-8 flex flex-wrap items-end gap-x-3 gap-y-3">
      {/* Paid / Credits / Balance：上小灰标签 + 下彩色胶囊（图标 + 金额） */}
      {BILL.segments.map((s) => (
        <span key={s.label} className="flex flex-col gap-1.5">
          <span className="pl-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500">{s.label}</span>
          <span
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold shadow-sm"
            style={{
              background: s.fill,
              color:
                s.label === 'Paid'
                  ? IV_COLOR.paidText
                  : s.label === 'Credits'
                    ? IV_COLOR.creditsText
                    : IV_COLOR.ink,
              border: s.label === 'Balance' ? '1px solid rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <SegmentGlyph label={s.label} />
            {s.amount}
          </span>
        </span>
      ))}

      {/* 竖条纹纹理段（未清余额可视化，纯 CSS repeating-gradient，flex-1 占满余量）
          2026-08-31 Claude·移动端适配：窄屏隐藏——纹理段在单列换行下会独占整行拉高面板 */}
      <span className="h-9 min-w-[3rem] flex-1 rounded-full hidden sm:block" style={{ background: STRIPE_FILL }} aria-hidden />

      {/* Days Outstanding 白描边胶囊 */}
      <span className="flex h-9 items-center gap-2 rounded-full border border-black/10 bg-white px-4 shadow-sm">
        <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">Days Outstanding</span>
        <span className="text-[12px] font-semibold" style={{ color: IV_COLOR.ink }}>{BILL.daysOutstanding}</span>
      </span>

      {/* Pay Invoice 黑胶囊 */}
      <button
        type="button"
        className="h-9 rounded-full px-5 text-[12px] font-semibold text-white shadow-md transition-transform duration-200 hover:-translate-y-px"
        style={{ background: IV_COLOR.ink }}
      >
        Pay Invoice
      </button>
    </div>
  );
}

/* ───────────────────────── 左列：Invoice lines ───────────────────────── */

/** 商品卡：图左文右（竖长小图 + 名称 / 价格）+ 底部「大数字 Qty + Store 2 + ⋯」区 */
function ItemCard({ item }: { item: (typeof BILL.items)[number] }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-zinc-50/80 p-2.5">
      <div className="flex items-center gap-2.5">
        <img
          src={item.src}
          alt={item.name}
          loading="lazy"
          className="h-12 w-10 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold" style={{ color: IV_COLOR.ink }}>{item.name}</p>
          <p className="mt-0.5 text-[11px] text-zinc-500">{item.price}</p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-black/5 pt-2">
        <p className="flex items-baseline gap-1">
          <span className="text-[16px] font-semibold leading-none" style={{ color: IV_COLOR.ink }}>{item.qtyNum}</span>
          <span className="text-[10px] text-zinc-400">Qty</span>
        </p>
        <span className="truncate text-[11px] text-zinc-500">{item.store}</span>
        <span className="text-[13px] leading-none text-zinc-400" aria-hidden>⋯</span>
      </div>
    </div>
  );
}

/** 左列：Invoice lines 白色大卡（选中标签页 = 卡本体）+ Details / Docs / Notes 外挂浅胶囊
 *  2026-08-31 Claude·移动端适配：窄屏外挂胶囊列改为「卡下方横排」——
 *  竖排侧挂在 315px 宽下会把白卡压得过窄；md 起恢复原图侧挂形态。 */
function LinesPanel() {
  return (
    <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start">
      <section className="min-w-0 flex-1 rounded-3xl bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-[14px] font-semibold" style={{ color: IV_COLOR.ink }}>Invoice lines</h3>

        {/* 67 Items 工具行：数量 + 下划线式搜索框 + 三颗工具小圆钮 */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="flex items-baseline gap-1">
            <span className="text-[18px] font-semibold leading-none" style={{ color: IV_COLOR.ink }}>{BILL.itemsTotal}</span>
            <span className="text-[11px] text-zinc-400">Items</span>
          </p>
          {/* 下划线式搜索框（静态示意，无输入状态） */}
          <span className="mx-1 hidden min-w-[7rem] flex-1 border-b border-zinc-300 pb-1 text-[11px] text-zinc-400 sm:block">
            Search items
          </span>
          {['filter', 'sort', 'more'].map((t) => (
            <span
              key={t}
              role="img"
              aria-label={t}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500"
            >
              <ToolGlyph type={t} />
            </span>
          ))}
        </div>

        {/* 商品网格：2 / 3 列自适应 */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {BILL.items.map((it) => (
            <ItemCard key={it.name} item={it} />
          ))}
        </div>
      </section>

      {/* 未选中标签页：外挂浅胶囊列（浮在渐变上，与卡标题齐平；窄屏横排在卡下方） */}
      <div className="flex shrink-0 flex-row gap-2 md:flex-col md:pt-9">
        {BILL.tabs.slice(1).map((t) => (
          <span
            key={t}
            className="flex flex-1 items-center justify-center whitespace-nowrap rounded-full bg-white/70 px-4 py-2 text-[12px] font-medium text-zinc-500 shadow-sm backdrop-blur-sm md:flex-none"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── 右列：Activity ───────────────────────── */

/** 事件卡：左上日期时间 + 标题 / 副文 + 左下真人头像 + 右侧居中 ✎ 白圆钮（紫 / 黄渐变） */
function ActivityCard({ a }: { a: (typeof BILL.activities)[number] }) {
  const violet = a.tone === 'violet';
  return (
    <article
      className="relative overflow-hidden rounded-2xl p-4 pr-14 text-white shadow-md"
      style={{
        background: violet
          ? `linear-gradient(140deg, ${IV_COLOR.violetFrom}, ${IV_COLOR.violetTo})`
          : `linear-gradient(140deg, ${IV_COLOR.amber}, ${IV_COLOR.amberTo})`,
      }}
    >
      {/* 左上：日期 + 时间（拆分展示，对照原图左上日期列） */}
      <p className="text-[12px] font-semibold leading-none">
        {a.date}
        {a.time && <span className="ml-1.5 font-normal text-white/80">{a.time}</span>}
      </p>
      {/* 标题 + 副文 */}
      <p className="mt-2.5 text-[14px] font-semibold leading-snug">{a.action}</p>
      {a.note && <p className="mt-1 text-[11px] text-white/85">{a.note}</p>}
      {/* 左下：事件人物真人头像（本地入库图） */}
      <img
        src={a.avatarSrc}
        alt={a.person}
        loading="lazy"
        className="mt-4 h-7 w-7 rounded-full object-cover ring-2 ring-white/40"
      />
      {/* 右侧垂直居中：✎ 编辑白圆钮 */}
      <span
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm"
        aria-hidden
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
      </span>
    </article>
  );
}

/** 右列：Activity 白卡 —— ⊕ 添加圆钮排 + 右上标题 + 12 Activities + Upcoming + 两张事件卡 */
function ActivityPanel() {
  return (
    <aside className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
      {/* 第一行：6 颗 ⊕ 白圆钮横排 + 右上 Activity 标题 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-500"
            >
              {/* ⊕ 圆内加号（对照原图 Activity 卡右上方的添加圆钮排） */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </span>
          ))}
        </div>
        <h3 className="text-[14px] font-semibold" style={{ color: IV_COLOR.ink }}>Activity</h3>
      </div>

      {/* 右对齐统计：12 Activities（数字大粗 + 单位灰小） */}
      <p className="mt-3 flex items-baseline justify-end gap-1">
        <span className="text-[18px] font-semibold leading-none" style={{ color: IV_COLOR.ink }}>{BILL.activitiesCount}</span>
        <span className="text-[11px] text-zinc-400">Activities</span>
      </p>

      {/* Upcoming 小节标题 */}
      <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">Upcoming</p>

      {/* 事件卡列：紫（Send Payment Reminder）/ 黄（Call about the contract） */}
      <div className="mt-2.5 space-y-3">
        {BILL.activities.map((a) => (
          <ActivityCard key={a.action} a={a} />
        ))}
      </div>
    </aside>
  );
}

/* ───────────────────────── 原型出口 ───────────────────────── */

export default function InvoiceDashboard() {
  return (
    <div
      /* 宽度铁律：min(1000px, 84vw)；外圈黑色粗边框 = 原图 iPad 机身感；
         粉彩渐变即面板本体（不再叠白玻璃大卡） */
      style={{
        width: 'min(1000px, 84vw)',
        fontFamily: IV_FONT,
        border: '8px solid #17171a',
        borderRadius: 34,
        background: PANEL_GRADIENT,
        overflow: 'hidden',
        boxShadow: '0 40px 90px -30px rgba(60,55,90,0.5)',
      }}
      className="text-[13px] text-zinc-800"
    >
      <div className="p-4 md:p-6">
        {/* 顶栏：sf. / ⋮⋮ / ← / Invoice / 操作胶囊 / 头像 / 搜索 */}
        <TopBar />
        {/* 金额行：receipt 描边圆 + 分级大金额 + 三组元信息 */}
        <AmountHero />
        {/* 进度行：三胶囊 + 竖条纹段 + Days Outstanding + Pay Invoice */}
        <ProgressRow />
        {/* 主体两列：Invoice lines 白卡 + 外挂标签胶囊 / Activity 白卡 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <LinesPanel />
          <ActivityPanel />
        </div>
      </div>
    </div>
  );
}