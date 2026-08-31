/**
 * InvoiceMobile —— IN-02「柔性账单」变体 V1 · 移动账单
 * 2026-08-31 Claude·新增：把原型（InvoiceDashboard）的账单语言折进竖屏形态——
 *   同一份 BILL 数据（invoiceShared.ts），金额海报、三胶囊、分段进度
 *   重排为单列动线，Activity 收成单卡，商品行改横向滑卡；
 *   视觉语言（白玻璃 + 粉彩底 + 黑色主按钮）与原型一致；
 *   铁律遵守：宽度 min(340px, 84vw)、字体栈自包含、纯静态零 hooks；
 *   加载键：'invoice-dashboard:mobile'（见 GlassMount LOADERS）。
 */

import { BILL, IV_COLOR, IV_FONT } from '../invoiceShared';

export default function InvoiceMobile() {
  return (
    <div
      /* 手机壳：粉彩渐变底 + 深色描边（宽度铁律 min(340px, 84vw)） */
      style={{
        width: 'min(340px, 84vw)',
        fontFamily: IV_FONT,
        background: 'linear-gradient(170deg, #eaf6ef, #ece9fa)',
        boxShadow: '0 40px 90px -28px rgba(80,70,120,0.5)',
      }}
      className="rounded-[36px] border border-white/70 p-4 text-[13px] text-zinc-800"
    >
      {/* 状态栏（形态示意，静态） */}
      <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-zinc-500">
        <span>9:41</span>
        <span className="flex items-center gap-1" aria-hidden>
          <i className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          <i className="h-1.5 w-3 rounded-full bg-zinc-400" />
          <i className="h-1.5 w-5 rounded-full bg-zinc-300" />
        </span>
      </div>

      {/* 账户 + 金额海报 */}
      <div className="mt-5 rounded-3xl bg-white/75 p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          Account · {BILL.account}
        </p>
        <p
          className="mt-2 leading-none tracking-tight"
          style={{ fontSize: 'clamp(2rem, 8vw, 2.6rem)', fontWeight: 200, color: IV_COLOR.ink }}
        >
          {BILL.total}
        </p>
        <p className="mt-2 text-[11px] text-zinc-500">
          {BILL.invoiceNo} · {BILL.status}
        </p>

        {/* 三胶囊（紧凑横排） */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {BILL.segments.map((s) => (
            <span
              key={s.label}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium"
              style={{
                background: s.label === 'Balance' ? '#ffffff' : `${s.color}30`,
                color: '#3f3f46',
                border: s.label === 'Balance' ? '1px solid rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <i className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} aria-hidden />
              {s.label} {s.amount}
            </span>
          ))}
        </div>

        {/* 分段进度（与原型同一数据，段宽按金额） */}
        <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/70 shadow-inner">
          {BILL.segments.map((s) => (
            <span key={s.label} style={{ flexGrow: s.value, background: s.color }} className="h-full first:rounded-l-full last:rounded-r-full" />
          ))}
        </div>
      </div>

      {/* Activity 单卡（紫卡，原型同款事件之一） */}
      <div
        className="mt-3 flex items-center gap-3 rounded-2xl p-3.5 text-white shadow-md"
        style={{ background: `linear-gradient(140deg, ${IV_COLOR.violetFrom}, ${IV_COLOR.violetTo})` }}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/25 text-[10px] font-semibold">
          {BILL.activities[0].initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold">{BILL.activities[0].action}</p>
          <p className="text-[10px] text-white/85">
            {BILL.activities[0].person} · {BILL.activities[0].when}
          </p>
        </div>
      </div>

      {/* 商品横滑卡（静态展示前三行，overflow-x 提示形态） */}
      <div className="-mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 pb-1">
        {BILL.items.slice(0, 3).map((it) => (
          <div key={it.name} className="w-28 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm">
            <img src={it.src} alt={it.name} loading="lazy" className="h-16 w-full object-cover" />
            <div className="p-2">
              <p className="truncate text-[10px] font-semibold">{it.name}</p>
              <p className="mt-0.5 text-[10px] text-zinc-500">
                <span className="font-semibold text-zinc-700">{it.price}</span> · {it.qty}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 主行动：Pay Invoice 黑色大按钮 */}
      <button
        type="button"
        className="mt-4 w-full rounded-2xl py-3 text-[13px] font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-px"
        style={{ background: IV_COLOR.ink }}
      >
        Pay Invoice
      </button>
    </div>
  );
}
