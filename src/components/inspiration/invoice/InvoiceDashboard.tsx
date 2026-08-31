/**
 * InvoiceDashboard —— IN-02「柔性账单」原型 · 发票工作台整版复刻
 * 2026-08-31 Claude·新增（用户提供的 Invoice Dashboard 设计图 1:1 复刻）：
 *   - 布局：顶栏（sf. logo / 搜索圆钮 / 操作胶囊 / 头像）→ 主体两列
 *     （左：Account + 超大极细金额 + 三胶囊 + 分段进度 + Pay Invoice +
 *     文件夹式标签页；右：Activity 事件流紫 / 琥珀两卡）→ 67 Items
 *     商品网格（六卡，文生图商品图）；
 *   - 数据 1:1 对照设计稿（Bill 常量见 invoiceShared.ts，不自创数字）；
 *   - 铁律遵守：宽度 min(980px, 84vw) 钳制；字体栈自包含系统无衬线；
 *     纯静态 JSX 零状态零 hooks（详情页经 GlassMount dynamic ssr:false 加载）；
 *     商品图为站方约定文生图 API 直链，<img> 原生标签（项目 images.unoptimized）；
 *   - 加载键：'invoice-dashboard'（见 GlassMount LOADERS）。
 */

import { artUrl, BILL, BILL_ACTIONS, IV_COLOR, IV_FONT } from './invoiceShared';

/** 分段进度条：三段宽度按金额占比（flex-grow 数值即金额） */
function SegmentBar() {
  return (
    <div className="flex h-3 overflow-hidden rounded-full bg-white/60 shadow-inner">
      {BILL.segments.map((s) => (
        <span
          key={s.label}
          style={{ flexGrow: s.value, background: s.color }}
          className="h-full first:rounded-l-full last:rounded-r-full"
          aria-label={`${s.label} ${s.amount}`}
        />
      ))}
    </div>
  );
}

export default function InvoiceDashboard() {
  return (
    <div
      /* 宽度铁律：min(980px, 84vw)；白玻璃卡体压在粉彩舞台上 */
      style={{
        width: 'min(980px, 84vw)',
        fontFamily: IV_FONT,
        background: 'linear-gradient(165deg, rgba(255,255,255,0.86), rgba(255,255,255,0.7))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 40px 90px -30px rgba(80,70,120,0.45)',
      }}
      className="rounded-[28px] p-4 text-[13px] text-zinc-800 md:p-6"
    >
      {/* ── 顶栏：logo · 搜索 · 操作胶囊 · 头像 ── */}
      <header className="flex flex-wrap items-center gap-2.5">
        {/* sf. 黑色圆 logo */}
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold text-white"
          style={{ background: IV_COLOR.ink }}
          aria-label="sf logo"
        >
          sf.
        </span>

        <span className="flex-1" />

        {/* 搜索圆钮（hover 微亮，纯 CSS） */}
        <button
          type="button"
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm transition-colors duration-200 hover:bg-zinc-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>

        {/* 操作胶囊组：Issue Credit / Edit / Delete */}
        {BILL_ACTIONS.map((a) => (
          <button
            key={a}
            type="button"
            className="h-9 rounded-full bg-white px-4 text-[12px] font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow"
          >
            {a}
          </button>
        ))}

        {/* 账户头像 */}
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ background: `linear-gradient(140deg, ${IV_COLOR.violetFrom}, ${IV_COLOR.violetTo})` }}
          aria-label="Ohana Inc. avatar"
        >
          O
        </span>
      </header>

      {/* ── 主体两列：左账单摘要 / 右 Activity ── */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        {/* 左列 */}
        <section className="rounded-3xl bg-white/70 p-5 md:p-6">
          {/* Account 行 */}
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">Account</p>
          <p className="mt-0.5 text-[15px] font-semibold">{BILL.account}</p>

          {/* 超大极细金额：⑥ 编辑式排版（海报级数字压住版面） */}
          <p
            className="mt-3 leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.4rem, 6.5vw, 4.4rem)', fontWeight: 200, color: IV_COLOR.ink }}
          >
            {BILL.total}
          </p>

          {/* 元信息行 */}
          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-zinc-500">
            <span>
              Invoice Number <span className="font-semibold text-zinc-700">{BILL.invoiceNo}</span>
            </span>
            <span>
              Status <span className="font-semibold text-zinc-700">{BILL.status}</span>
            </span>
          </p>

          {/* 三胶囊：Paid 绿 / Credits 黄 / Balance 白 */}
          <div className="mt-5 flex flex-wrap gap-2">
            {BILL.segments.map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium shadow-sm"
                style={{
                  background: s.label === 'Balance' ? '#ffffff' : `${s.color}2e`,
                  color: s.label === 'Balance' ? IV_COLOR.ink : '#3f3f46',
                  border: s.label === 'Balance' ? '1px solid rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <i className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden />
                {s.label} · {s.amount}
              </span>
            ))}
          </div>

          {/* 分段进度 + 溯龄 */}
          <div className="mt-4">
            <SegmentBar />
            <p className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[12px] text-zinc-500">
              <span>
                Days Outstanding <span className="font-semibold text-zinc-700">{BILL.daysOutstanding}</span>
              </span>
              <button
                type="button"
                className="rounded-full px-5 py-2 text-[12px] font-semibold text-white shadow-md transition-transform duration-200 hover:-translate-y-px"
                style={{ background: IV_COLOR.ink }}
              >
                Pay Invoice
              </button>
            </p>
          </div>

          {/* 文件夹式标签页（首项选中：与下方内容连体） */}
          <div className="mt-6 flex items-end gap-1" role="tablist" aria-label="Invoice sections">
            {BILL.tabs.map((t, i) => {
              const active = i === 0;
              return (
                <span
                  key={t}
                  role="tab"
                  aria-selected={active}
                  className={`rounded-t-xl px-4 py-2 text-[12px] font-medium ${
                    active ? 'bg-zinc-900 text-white' : 'bg-white/80 text-zinc-500'
                  }`}
                >
                  {t}
                </span>
              );
            })}
          </div>
          <div className="h-1.5 rounded-b-xl bg-zinc-900/90" aria-hidden />
        </section>

        {/* 右列：Activity 事件流 */}
        <aside className="rounded-3xl bg-white/70 p-5 md:p-6">
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] font-semibold">Activity</p>
            <p className="text-[11px] font-medium text-zinc-400">{BILL.activitiesCount} Activities</p>
          </div>

          <div className="mt-4 space-y-3">
            {BILL.activities.map((a) => {
              const violet = a.tone === 'violet';
              return (
                <div
                  key={a.action}
                  className="rounded-2xl p-4 text-white shadow-md"
                  style={{
                    background: violet
                      ? `linear-gradient(140deg, ${IV_COLOR.violetFrom}, ${IV_COLOR.violetTo})`
                      : `linear-gradient(140deg, ${IV_COLOR.amber}, #fcd34d)`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* 首字母头像（白色半透明圆） */}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-[11px] font-semibold">
                      {a.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold leading-snug">{a.action}</p>
                      <p className="mt-1 text-[11px] text-white/85">
                        {a.person} · {a.when}
                      </p>
                    </div>
                    {/* 箭头小圆钮 */}
                    <span
                      className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/25 text-[11px]"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* ── 67 Items 商品网格：六卡（上图下文）── */}
      <section className="mt-4 rounded-3xl bg-white/70 p-5 md:p-6">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-semibold">Invoice lines</p>
          <p className="text-[11px] font-medium text-zinc-400">{BILL.itemsTotal} Items</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BILL.items.map((it) => (
            <div key={it.name} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* 商品图：文生图 API 直链（原生 img，项目 images.unoptimized） */}
              <img
                src={artUrl(it.prompt)}
                alt={it.name}
                loading="lazy"
                className="h-24 w-full object-cover md:h-28"
              />
              <div className="p-3">
                <p className="truncate text-[12px] font-semibold">{it.name}</p>
                <p className="mt-0.5 flex items-baseline justify-between text-[11px] text-zinc-500">
                  <span className="font-semibold text-zinc-700">{it.price}</span>
                  <span>{it.qty}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
