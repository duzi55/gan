/**
 * animals.tsx —— IN-07 人群登录：手绘简笔动物 SVG 库
 * 2026-09-08 Claude·新增（hilos.sh 登录页复刻）：
 *   - 复刻 hilos 登录页「黑白手绘动物人群」的视觉语言：粗黑描边、
 *     白填充、豆豆眼、圆头圆脑，只露头；
 *   - 12 种动物 + 滑板狗（原站登录卡 logo 同款），全部纯 SVG 手写，
 *     零图片资源、零运行时请求；
 *   - 每个组件接收 className（尺寸 / transform 由调用方控制），
 *     单头自包含 <svg>，被 CrowdField / CrowdKeys / CrowdWall 复用（解耦）。
 * 2026-09-08 Claude·配置项（用户点单「边框太粗，提供配置项」）：
 *   - 描边粗细不再写死（原 4.5），改由 CSS 变量 --hl-sw 驱动：各 svg 根
 *     style 注入 var(--hl-sw, 3.2) 并继承到全部子元素；胡须/嘴线等局部
 *     细线按 calc(var(--hl-sw) × 系数) 联动；默认 3.2，调参见
 *     hilosShared.CrowdConfig 与 CrowdLogin 右下角「人群调参」面板。
 */

type IconProps = { className?: string };

/** 共用描边颜色（粗细走 CSS 变量 --hl-sw，由各 svg 根 style 注入并继承到子元素，
 *  见文件头 2026-09-08 配置项说明；默认 3.2，CrowdLogin 调参面板可实时改） */
const STROKE = '#181818';
const COMMON = {
  fill: '#ffffff',
  stroke: STROKE,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** 豆豆眼（两眼一对，黑实心） */
function Eyes({ y, dx, r = 3.4 }: { y: number; dx: number; r?: number }) {
  return (
    <g fill={STROKE} stroke="none">
      <circle cx={50 - dx} cy={y} r={r} />
      <circle cx={50 + dx} cy={y} r={r} />
    </g>
  );
}

/** 狗 · 下垂大耳 */
export function DogIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M28 40 q-17 1 -16 23 q1 14 13 14 q8 0 9 -10" />
        <path d="M72 40 q17 1 16 23 q-1 14 -13 14 q-8 0 -9 -10" />
        <ellipse cx="50" cy="57" rx="32" ry="29" />
      </g>
      <Eyes y={52} dx={11} />
      <g {...COMMON}>
        <ellipse cx="50" cy="66" rx="6.5" ry="5" fill={STROKE} stroke="none" />
        <path d="M50 71 q0 6 -7 7 M50 71 q0 6 7 7" fill="none" />
      </g>
    </svg>
  );
}

/** 猫 · 尖耳胡须 */
export function CatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M30 36 L25 12 q14 3 21 13" />
        <path d="M70 36 L75 12 q-14 3 -21 13" />
        <ellipse cx="50" cy="59" rx="31" ry="27" />
      </g>
      <Eyes y={55} dx={10} />
      <g {...COMMON}>
        <path d="M47 65 h6 l-3 5 z" fill={STROKE} stroke="none" />
        <path d="M24 60 h-13 M25 66 l-12 5 M76 60 h13 M75 66 l12 5" fill="none" style={{ strokeWidth: 'calc(var(--hl-sw, 3.2) * 0.75)' }} />
      </g>
    </svg>
  );
}

/** 兔 · 竖长耳 */
export function RabbitIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M40 35 q-10 -33 2 -34 q11 -1 8 34" />
        <path d="M60 35 q10 -33 -2 -34 q-11 -1 -8 34" />
        <ellipse cx="50" cy="61" rx="29" ry="26" />
      </g>
      <Eyes y={57} dx={9} />
      <g {...COMMON}>
        <circle cx="50" cy="66" r="3.6" fill={STROKE} stroke="none" />
        <path d="M50 70 v4 M50 74 q-4 4 -8 2 M50 74 q4 4 8 2" fill="none" style={{ strokeWidth: 'calc(var(--hl-sw, 3.2) * 0.75)' }} />
      </g>
    </svg>
  );
}

/** 熊 · 半圆耳 */
export function BearIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <circle cx="29" cy="31" r="11" />
        <circle cx="71" cy="31" r="11" />
        <ellipse cx="50" cy="57" rx="32" ry="29" />
        <ellipse cx="50" cy="68" rx="11" ry="8.5" />
      </g>
      <Eyes y={52} dx={10} />
      <ellipse cx="50" cy="64" rx="5.5" ry="4" fill={STROKE} stroke="none" />
    </svg>
  );
}

/** 猪 · 大鼻拱 */
export function PigIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M31 37 q-7 -15 4 -19 q9 -2 11 9" />
        <path d="M69 37 q7 -15 -4 -19 q-9 -2 -11 9" />
        <ellipse cx="50" cy="58" rx="31" ry="28" />
        <ellipse cx="50" cy="66" rx="13" ry="9" />
      </g>
      <Eyes y={50} dx={11} />
      <g fill={STROKE} stroke="none">
        <circle cx="45.5" cy="66" r="2.3" />
        <circle cx="54.5" cy="66" r="2.3" />
      </g>
    </svg>
  );
}

/** 熊猫 · 黑眼圈 */
export function PandaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g fill={STROKE} stroke="none">
        <circle cx="29" cy="30" r="11" />
        <circle cx="71" cy="30" r="11" />
      </g>
      <ellipse cx="50" cy="57" rx="31" ry="28" {...COMMON} />
      <g fill={STROKE} stroke="none">
        <ellipse cx="39" cy="54" rx="7" ry="9.5" transform="rotate(-14 39 54)" />
        <ellipse cx="61" cy="54" rx="7" ry="9.5" transform="rotate(14 61 54)" />
      </g>
      <g fill="#ffffff" stroke="none">
        <circle cx="40" cy="52" r="2.6" />
        <circle cx="60" cy="52" r="2.6" />
      </g>
      <ellipse cx="50" cy="68" rx="5.5" ry="4" fill={STROKE} stroke="none" />
    </svg>
  );
}

/** 企鹅 · 白脸黑背 */
export function PenguinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <ellipse cx="50" cy="54" rx="30" ry="33" fill={STROKE} stroke="none" />
      <path
        d="M50 36 q-19 -2 -19 21 q0 20 19 25 q19 -5 19 -25 q0 -23 -19 -21"
        fill="#ffffff"
        stroke="none"
      />
      <Eyes y={54} dx={9} r={3} />
      <path d="M44 63 q6 -5 12 0 q-6 8 -12 0" fill={STROKE} stroke="none" />
    </svg>
  );
}

/** 鳄鱼 · 头顶凸眼 + 微笑露齿 */
export function AlligatorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <circle cx="35" cy="33" r="8.5" />
        <circle cx="65" cy="33" r="8.5" />
        <path d="M21 52 q29 -13 58 0 q8 3 8 14 q0 17 -13 19 l-48 0 q-13 -2 -13 -19 q0 -11 8 -14" />
      </g>
      <g fill={STROKE} stroke="none">
        <circle cx="35" cy="33" r="3" />
        <circle cx="65" cy="33" r="3" />
        <circle cx="42" cy="55" r="2" />
        <circle cx="58" cy="55" r="2" />
      </g>
      <g {...COMMON} fill="none" style={{ strokeWidth: 'calc(var(--hl-sw, 3.2) * 0.8)' }}>
        <path d="M33 68 q17 9 34 0" />
        <path d="M42 72 v5 M58 72 v5" />
      </g>
    </svg>
  );
}

/** 猫头鹰 · 大眼圈 */
export function OwlIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M33 33 L28 14 q12 2 18 11" />
        <path d="M67 33 L72 14 q-12 2 -18 11" />
        <ellipse cx="50" cy="57" rx="30" ry="28" />
        <circle cx="39" cy="55" r="11" />
        <circle cx="61" cy="55" r="11" />
      </g>
      <g fill={STROKE} stroke="none">
        <circle cx="39" cy="55" r="4" />
        <circle cx="61" cy="55" r="4" />
        <path d="M50 63 l-4.5 6.5 h9 z" />
      </g>
    </svg>
  );
}

/** 牛 · 小角鼻板（头带一块黑斑） */
export function CowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M29 37 q-11 -4 -9 -17 q9 2 13 11" />
        <path d="M71 37 q11 -4 9 -17 q-9 2 -13 11" />
        <ellipse cx="50" cy="56" rx="29" ry="26" />
        <ellipse cx="50" cy="70" rx="16" ry="10" />
      </g>
      <path d="M38 33 q8 -7 15 0 q-2 9 -8 9 q-7 -1 -7 -9" fill={STROKE} stroke="none" />
      <Eyes y={52} dx={10} />
      <g fill={STROKE} stroke="none">
        <circle cx="44" cy="70" r="2.6" />
        <circle cx="56" cy="70" r="2.6" />
      </g>
    </svg>
  );
}

/** 狐狸 · 尖吻长耳 */
export function FoxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M32 37 L27 12 q13 3 19 13" />
        <path d="M68 37 L73 12 q-13 3 -19 13" />
        <path d="M50 88 q-23 -6 -27 -25 q-3 -17 9 -23 q18 -9 36 0 q12 6 9 23 q-4 19 -27 25" />
      </g>
      <Eyes y={54} dx={10} />
      <ellipse cx="50" cy="81" rx="5" ry="3.6" fill={STROKE} stroke="none" />
    </svg>
  );
}

/** 机器人 · 方头天线（人群里的「特工」梗：agents in the room） */
export function RobotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <rect x="25" y="32" width="50" height="44" rx="10" />
        <rect x="17" y="46" width="8" height="14" rx="3" />
        <rect x="75" y="46" width="8" height="14" rx="3" />
        <path d="M50 32 v-14" fill="none" />
      </g>
      <circle cx="50" cy="13" r="4.5" fill={STROKE} stroke="none" />
      <g fill={STROKE} stroke="none">
        <circle cx="40" cy="50" r="5" />
        <circle cx="60" cy="50" r="5" />
      </g>
      <g fill="#ffffff" stroke="none">
        <circle cx="41.5" cy="48.5" r="1.5" />
        <circle cx="61.5" cy="48.5" r="1.5" />
      </g>
      <path d="M41 64 h18" fill="none" stroke={STROKE} strokeLinecap="round" style={{ strokeWidth: 'calc(var(--hl-sw, 3.2) * 0.8)' }} />
    </svg>
  );
}

/**
 * 滑板狗 · 登录卡 logo（原站同款：小狗踩滑板）
 * 2026-09-08 Claude·侧视全身像：身体 / 头 / 垂耳 / 翘尾 / 四腿收两笔，
 *   滑板长条 + 双轮；only 用于 CrowdLogin 卡片顶部。
 */
export function SkateDogIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 120 104" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        {/* 尾巴（上翘） */}
        <path d="M33 46 q-11 -3 -10 -15" fill="none" />
        {/* 身体 */}
        <ellipse cx="57" cy="52" rx="25" ry="18" />
        {/* 头 */}
        <circle cx="85" cy="35" r="15" />
        {/* 垂耳 */}
        <path d="M79 25 q-11 -9 -15 2 q-2 9 9 9" />
        {/* 腿 */}
        <path d="M47 67 v11 M67 67 v11" fill="none" />
        {/* 滑板 */}
        <path d="M12 84 q48 9 96 0" fill="none" style={{ strokeWidth: 'calc(var(--hl-sw, 3.2) * 1.2)' }} />
      </g>
      {/* 鼻 + 眼 */}
      <g fill={STROKE} stroke="none">
        <circle cx="97" cy="35" r="3.6" />
        <circle cx="86" cy="31" r="2.6" />
        {/* 轮 */}
        <circle cx="34" cy="92" r="5" />
        <circle cx="86" cy="92" r="5" />
      </g>
    </svg>
  );
}
