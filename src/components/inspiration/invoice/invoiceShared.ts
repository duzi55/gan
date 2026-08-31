/**
 * invoiceShared —— IN-02「柔性账单」原型与变体的共享数据 / 样式常量
 * 2026-08-31 Claude·解耦抽离（应用户规则：新功能严禁高耦合）：
 *   - InvoiceDashboard（原型）/ InvoiceMobile / InvoiceReceipt（变体）
 *     共用同一份账单数据 BILL 与视觉常量，保证「同一张发票」跨形态一致；
 *   - 改数字只动本文件，三件组件同步生效；
 *   - 字体栈 IV_FONT 自包含系统无衬线（站点 body 为衬线中文体系，
 *     发票 UI 是英文无衬线设计稿，不能继承 body 字体）；
 *   - 商品图 / 人物头像用本地入库图 /gan/images/inspiration/invoice/
 *     （2026-08-31 Claude·修复裂图：原为站方文生图 API 运行时直链，
 *     浏览器现场生成不稳定（抓到「生成中」占位图甚至超时裂图），
 *     已按站点「图在仓库里永不断链」规范预先生成入库，字段直接存 src 路径）。
 * 2026-08-31 Claude·二版校对（应用户反馈「与原图相差甚远」）：
 *   - items 拆分 qtyNum / store（原图商品卡底部为「大数字 Qty + Store 2 + ⋯」结构）；
 *   - activities 拆分 date / time，补充 note 与人物头像 prompt（原图事件卡左下为真人头像）；
 *   - 新增 TOPBAR_AVATAR（顶栏真人头像）与 PANEL_GRADIENT（面板粉彩渐变常量）；
 *   - 商品图 prompt 改为深色摄影棚产品渲染（对照原图深底商品图）。
 */

/** 发票 UI 无衬线字体栈（自包含，不依赖全局 --font-*） */
export const IV_FONT =
  '-apple-system, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/** 语义配色（对照设计图）：Paid 绿 / Credits 黄 / Balance 白 / 事件紫 / 事件黄 */
export const IV_COLOR = {
  paid: '#7ee2a8', // 浅绿胶囊（对照原图 Paid 底色）
  paidText: '#14532d',
  credits: '#f2e85c', // 亮黄胶囊（对照原图 Credits 底色）
  creditsText: '#3f3f15',
  balance: '#ffffff',
  violetFrom: '#c4b2f8', // 事件紫（原图浅紫渐变）
  violetTo: '#a78bfa',
  amber: '#f4ee86', // 事件黄（原图浅黄卡）
  amberTo: '#efe36a',
  ink: '#1b1b1f', // 主墨（近黑）
  sub: '#8a8a93', // 次级灰
} as const;

/** 面板粉彩渐变（对照原图：左上薄荷 → 右上淡紫 → 底部奶油黄） */
export const PANEL_GRADIENT =
  'radial-gradient(90% 75% at 12% 6%, rgba(186,233,203,0.95), transparent 62%),' +
  'radial-gradient(85% 65% at 90% 16%, rgba(203,209,242,0.92), transparent 58%),' +
  'radial-gradient(80% 60% at 46% 105%, rgba(240,233,193,0.95), transparent 62%),' +
  'linear-gradient(150deg, #cbe9d5, #d5daf1 46%, #e8ecd0)';

/** 竖条纹纹理段（Balance 胶囊右侧的「未清时长」纹理，纯 CSS） */
export const STRIPE_FILL =
  'repeating-linear-gradient(90deg, rgba(255,255,255,0.92) 0 3px, rgba(126,138,120,0.38) 3px 5px)';

/** 账单数据（数字与文案 1:1 对照用户设计图，不自创） */
export const BILL = {
  brand: 'sf.',
  account: 'Ohana Inc.',
  total: '$68,575.00',
  invoiceNo: 'INV-4905',
  status: 'Posted',
  daysOutstanding: '8 days',
  /** 分段进度三段（金额决定段宽比例；fill 为胶囊底色） */
  segments: [
    { label: 'Paid', amount: '$25,000', color: IV_COLOR.paid, fill: IV_COLOR.paid, value: 25000 },
    { label: 'Credits', amount: '$10,000', color: IV_COLOR.credits, fill: IV_COLOR.credits, value: 10000 },
    { label: 'Balance', amount: '$38,575', color: IV_COLOR.balance, fill: IV_COLOR.balance, value: 38575 },
  ],
  /** 标签页（首项为选中态 = Invoice lines 白卡本体） */
  tabs: ['Invoice lines', 'Details', 'Docs', 'Notes'],
  /** Activity 事件卡（tone 对应 紫 / 黄 两卡；date+time 拆分对照原图左上日期列） */
  activitiesCount: 12,
  activities: [
    {
      tone: 'violet' as const,
      action: 'Send Payment Reminder',
      person: 'Jess Johnson',
      note: 'sent a payment reminder',
      date: '12 Feb',
      time: '11 pm',
      when: '12 Feb · 11 pm',
      initials: 'JJ',
      avatarSrc: '/gan/images/inspiration/invoice/avatar-jess.jpg',
    },
    {
      tone: 'amber' as const,
      action: 'Call about the contract',
      person: 'Brian Carpenter',
      note: '',
      date: '13 Feb',
      time: '',
      when: '13 Feb',
      initials: 'BC',
      avatarSrc: '/gan/images/inspiration/invoice/avatar-brian.jpg',
    },
  ],
  itemsTotal: 67,
  /** 商品行（qtyNum 大数字 + qty 文案双格式：原型用拆分式，变体沿用 qty 文案） */
  items: [
    { name: 'iPhone 14 Pro', price: '$850', qtyNum: '20', qty: 'Qty 20', store: 'Store 2', src: '/gan/images/inspiration/invoice/item-iphone14pro.jpg' },
    { name: 'iPhone 14', price: '$790', qtyNum: '20', qty: 'Qty 20', store: 'Store 2', src: '/gan/images/inspiration/invoice/item-iphone14.jpg' },
    { name: 'MacBook Pro 13', price: '$1,600', qtyNum: '10', qty: 'Qty 10', store: 'Store 2', src: '/gan/images/inspiration/invoice/item-macbookpro.jpg' },
    { name: 'MacBook Air M1', price: '$1,100', qtyNum: '12', qty: 'Qty 12', store: 'Store 2', src: '/gan/images/inspiration/invoice/item-macbookair.jpg' },
    { name: 'iMac 27"', price: '$1,300', qtyNum: '6', qty: 'Qty 6', store: 'Store 2', src: '/gan/images/inspiration/invoice/item-imac.jpg' },
    { name: 'iPhone 15', price: '$800', qtyNum: '9', qty: 'Qty 9', store: 'Store 2', src: '/gan/images/inspiration/invoice/item-iphone15.jpg' },
  ],
} as const;

/** 顶部操作胶囊（Issue Credit / Edit / Delete，白色胶囊按钮组，图标在原型内映射） */
export const BILL_ACTIONS = ['Issue Credit', 'Edit', 'Delete'] as const;

/** 顶栏真人头像（对照原图搜索钮左侧的暖色人物头像；2026-08-31 Claude·改本地入库图） */
export const TOPBAR_AVATAR = '/gan/images/inspiration/invoice/avatar-topbar.jpg';
