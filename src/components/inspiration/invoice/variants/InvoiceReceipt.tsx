/**
 * InvoiceReceipt —— IN-02「柔性账单」变体 V2 · 支付回执
 * 2026-08-31 Claude·新增：账单「结清时刻」的凭证形态——同一份 BILL 数据
 *   （invoiceShared.ts）在收据语汇下的再排布：绿色对勾、余额化零的明细、
 *   底部 CSS 条码收尾；视觉语言（白玻璃 + 粉彩 + 黑墨）与原型一致；
 *   铁律遵守：宽度 min(360px, 84vw)、字体栈自包含、纯静态零 hooks、
 *   条码用 repeating-linear-gradient 纯 CSS（零图片）；
 *   加载键：'invoice-dashboard:receipt'（见 GlassMount LOADERS）。
 */

import { BILL, IV_COLOR, IV_FONT } from '../invoiceShared';

export default function InvoiceReceipt() {
  return (
    <div
      /* 回执卡体：白玻璃（宽度铁律 min(360px, 84vw)） */
      style={{
        width: 'min(360px, 84vw)',
        fontFamily: IV_FONT,
        background: 'linear-gradient(170deg, rgba(255,255,255,0.94), rgba(255,255,255,0.82))',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 40px 90px -28px rgba(80,70,120,0.5)',
      }}
      className="rounded-[28px] p-6 text-[13px] text-zinc-800"
    >
      {/* 品牌行：sf. 黑圆 logo + 凭证名 */}
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold text-white"
          style={{ background: IV_COLOR.ink }}
          aria-hidden
        >
          sf.
        </span>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Payment Receipt
        </p>
      </div>

      {/* 成功对勾：绿色圆 + 白勾（纯 CSS） */}
      <div className="mt-6 flex flex-col items-center">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white shadow-lg"
          style={{ background: IV_COLOR.paid }}
          aria-hidden
        >
          ✓
        </span>
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400">Paid</p>
        <p
          className="mt-1 leading-none tracking-tight"
          style={{ fontSize: '2.4rem', fontWeight: 200, color: IV_COLOR.ink }}
        >
          {BILL.segments[2].amount}.00
        </p>
        <p className="mt-2 text-[11px] text-zinc-500">
          {BILL.invoiceNo} · {BILL.account}
        </p>
      </div>

      {/* 撕票虚线分隔 */}
      <div className="my-5 border-t border-dashed border-zinc-300" aria-hidden />

      {/* 明细行：总额 → 已付 → 抵扣 → 结清余额 */}
      <dl className="space-y-2.5 text-[12px]">
        <div className="flex items-center justify-between text-zinc-500">
          <dt>Invoice total</dt>
          <dd className="font-medium text-zinc-700">{BILL.total}</dd>
        </div>
        <div className="flex items-center justify-between text-zinc-500">
          <dt>Paid</dt>
          <dd className="font-medium text-zinc-700">{BILL.segments[0].amount}</dd>
        </div>
        <div className="flex items-center justify-between text-zinc-500">
          <dt>Credits</dt>
          <dd className="font-medium text-zinc-700">{BILL.segments[1].amount}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-200 pt-2.5">
          <dt className="font-semibold">Balance settled</dt>
          <dd className="font-semibold" style={{ color: IV_COLOR.ink }}>
            {BILL.segments[2].amount}
          </dd>
        </div>
      </dl>

      {/* 底部条码：repeating-linear-gradient 纯 CSS（零图片零脚本） */}
      <div className="mt-6 flex flex-col items-center">
        <span
          className="h-12 w-48"
          style={{
            background:
              'repeating-linear-gradient(90deg, #18181b 0 2px, transparent 2px 4px, #18181b 4px 7px, transparent 7px 9px, #18181b 9px 10px, transparent 10px 14px)',
          }}
          aria-hidden
        />
        <p className="mt-2 font-mono text-[10px] tracking-[0.3em] text-zinc-400">{BILL.invoiceNo}</p>
      </div>
    </div>
  );
}
