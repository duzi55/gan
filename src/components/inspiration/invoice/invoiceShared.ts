/**
 * invoiceShared —— IN-02「柔性账单」原型与变体的共享数据 / 样式常量
 * 2026-08-31 Claude·解耦抽离（应用户规则：新功能严禁高耦合）：
 *   - InvoiceDashboard（原型）/ InvoiceMobile / InvoiceReceipt（变体）
 *     共用同一份账单数据 BILL 与视觉常量，保证「同一张发票」跨形态一致；
 *   - 改数字只动本文件，三件组件同步生效；
 *   - 字体栈 IV_FONT 自包含系统无衬线（站点 body 为衬线中文体系，
 *     发票 UI 是英文无衬线设计稿，不能继承 body 字体）；
 *   - 商品图用站方约定的文生图 API 直链（URL 即 src，无本地资源、无占位图）。
 */

/** 发票 UI 无衬线字体栈（自包含，不依赖全局 --font-*） */
export const IV_FONT =
  '-apple-system, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/** 语义配色（对照设计图）：Paid 绿 / Credits 黄 / Balance 白 / 事件紫 / 事件琥珀 */
export const IV_COLOR = {
  paid: '#34d399', // emerald-400
  credits: '#fbbf24', // amber-400
  balance: '#ffffff',
  violetFrom: '#8b7cf6', // Activity 紫
  violetTo: '#a78bfa',
  amber: '#fbbf24',
  ink: '#18181b', // 主墨（近黑）
  sub: '#71717a', // 次级灰
} as const;

/** 账单数据（数字与文案 1:1 对照用户设计图，不自创） */
export const BILL = {
  brand: 'sf.',
  account: 'Ohana Inc.',
  total: '$68,575.00',
  invoiceNo: 'INV-4905',
  status: 'Posted',
  daysOutstanding: '8 days',
  /** 分段进度三段（金额决定段宽比例） */
  segments: [
    { label: 'Paid', amount: '$25,000', color: IV_COLOR.paid, value: 25000 },
    { label: 'Credits', amount: '$10,000', color: IV_COLOR.credits, value: 10000 },
    { label: 'Balance', amount: '$38,575', color: IV_COLOR.balance, value: 38575 },
  ],
  /** 标签页（首项为选中态） */
  tabs: ['Invoice lines', 'Details', 'Docs', 'Notes'],
  /** Activity 事件卡（tone 对应 IV_COLOR 紫 / 琥珀两卡） */
  activitiesCount: 12,
  activities: [
    {
      tone: 'violet' as const,
      action: 'Send Payment Reminder',
      person: 'Jess Johnson',
      when: '12 Feb · 11 pm',
      initials: 'JJ',
    },
    {
      tone: 'amber' as const,
      action: 'Call about the contract',
      person: 'Brian Carpenter',
      when: '13 Feb',
      initials: 'BC',
    },
  ],
  itemsTotal: 67,
  items: [
    { name: 'iPhone 14 Pro', price: '$850', qty: 'Qty 20', prompt: 'space black smartphone product photo, pastel mint background, studio lighting, minimal' },
    { name: 'iPhone 14', price: '$790', qty: 'Qty 20', prompt: 'blue smartphone product photo, pastel lavender background, studio lighting, minimal' },
    { name: 'MacBook Pro 13', price: '$1,600', qty: 'Qty 10', prompt: 'silver laptop product photo, pastel mint background, studio lighting, minimal' },
    { name: 'MacBook Air M1', price: '$1,100', qty: 'Qty 5', prompt: 'thin gold ultrabook laptop product photo, pastel lavender background, studio lighting, minimal' },
    { name: 'iMac 27"', price: '$1,300', qty: 'Qty 4', prompt: 'teal all in one desktop computer product photo, pastel blue background, studio lighting, minimal' },
    { name: 'iPhone 15', price: '$800', qty: 'Qty 6', prompt: 'pink smartphone product photo, pastel peach background, studio lighting, minimal' },
  ],
} as const;

/** 顶部操作胶囊（Issue Credit / Edit / Delete，白色胶囊按钮组） */
export const BILL_ACTIONS = ['Issue Credit', 'Edit', 'Delete'] as const;

/**
 * 文生图直链（站方约定 API）：prompt 运行时 encodeURIComponent，
 * image_size 取 square（商品方图）。
 */
export function artUrl(prompt: string): string {
  return `https://console.enterprise.trae.cn/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`;
}
