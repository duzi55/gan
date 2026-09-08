/**
 * animals.tsx —— IN-07 人群登录：手绘简笔动物 SVG 库（角色级 v2）
 * 2026-09-08 Claude·新增（hilos.sh 登录页复刻）：
 *   - 复刻 hilos 登录页「黑白手绘动物人群」的视觉语言：粗黑描边、
 *     白填充、豆豆眼，全部纯 SVG 手写，零图片资源、零运行时请求。
 * 2026-09-08 Claude·角色级重画 v2（用户点单「动物太简陋，对齐原站级别」）：
 *   - 从「正脸纯头部」升级为「头 + 颈肩 + 衣领」的角色立绘（原站同款
 *     结构：肩膀上沿被下一排动物叠住，层层叠叠）；
 *   - 脸部立体化：狗/狐狸吻部侧伸、鳄鱼长吻、熊猫环纹眼斑、机器人
 *     单眼大镜头（致敬原站）、熊高领毛衣、猫头鹰胸羽波浪纹；
 *   - 耳内廓 / 眉线 / 嘴线等细节走 0.7× 细线（calc 联动主描边）；
 *   - 描边粗细仍由 CSS 变量 --hl-sw 驱动（配置项见 hilosShared.CrowdConfig）。
 */

type IconProps = { className?: string };

/** 共用描边颜色（粗细走 CSS 变量 --hl-sw，svg 根 style 注入并继承） */
const STROKE = '#181818';
const COMMON = {
  fill: '#ffffff',
  stroke: STROKE,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** 细线组（嘴线 / 眉线 / 胡须 / 衣领纹，0.7× 主描边） */
function Fine({ children }: { children: React.ReactNode }) {
  return (
    <g {...COMMON} fill="none" style={{ strokeWidth: 'calc(var(--hl-sw, 3.2) * 0.7)' }}>
      {children}
    </g>
  );
}

/** 实心组（鼻头 / 眼睛 / 黑斑，填黑不描边） */
function Solid({ children }: { children: React.ReactNode }) {
  return (
    <g fill={STROKE} stroke="none">
      {children}
    </g>
  );
}

/**
 * 颈肩 + 衣领（角色感关键：不再是浮头）
 * collar：round 圆领 / v V 领 / turtle 高领（熊的毛衣，致敬原站）
 * fill：肩部填充（熊猫/企鹅黑肩传 STROKE）
 */
function Body({ collar = 'round', fill = '#ffffff' }: { collar?: 'round' | 'v' | 'turtle'; fill?: string }) {
  return (
    <g {...COMMON} fill={fill}>
      <path d="M16 102 q2 -30 34 -32 q32 2 34 32" />
      {collar === 'round' && <path d="M38 73 q12 8 24 0" fill="none" />}
      {collar === 'v' && <path d="M40 71 l10 13 l10 -13" fill="none" />}
      {collar === 'turtle' && <path d="M33 70 q17 7 34 0 M33 77 q17 7 34 0" fill="none" />}
    </g>
  );
}

/** 狗 · 吻部侧伸 + 大垂耳 */
export function DogIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        {/* 远耳（右侧后方，小） */}
        <path d="M64 20 q12 4 10 20 q-1 10 -9 10" />
        {/* 头 */}
        <ellipse cx="46" cy="40" rx="25" ry="23" />
        {/* 吻筒（向右前方伸出） */}
        <path d="M54 44 q18 -4 21 6 q2 10 -9 13 l-14 2 q-8 0 -7 -9 q0 -8 9 -12" />
      </g>
      {/* 近耳（左大垂耳填黑——原站同款黑耳狗，丰富人群黑白节奏） */}
      <path d="M28 24 q-17 2 -15 26 q1 15 14 15 q8 0 9 -10 l2 -20" fill={STROKE} stroke="none" />
      <Solid>
        <ellipse cx="73" cy="49" rx="5.5" ry="4.5" />
        <circle cx="42" cy="36" r="3.4" />
        <circle cx="58" cy="35" r="2.9" />
      </Solid>
      <Fine>
        <path d="M70 56 q-2 5 -8 6" />
        <path d="M36 28 q5 -3 10 -1" />
      </Fine>
      <Body collar="round" />
    </svg>
  );
}

/** 猫 · 尖耳内廓 + 胡须 + V 领 */
export function CatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M33 26 L29 6 q13 3 18 12" />
        <path d="M67 26 L71 6 q-13 3 -18 12" />
        <ellipse cx="50" cy="40" rx="24" ry="21" />
      </g>
      <Fine>
        <path d="M34 21 l-2 -9 q6 2 8 6 M66 21 l2 -9 q-6 2 -8 6" />
        <path d="M50 51 v3 M50 54 q-4 3 -8 1 M50 54 q4 3 8 1" />
        <path d="M26 44 h-11 M27 50 l-10 4 M74 44 h11 M73 50 l10 4" />
      </Fine>
      <Solid>
        <path d="M47 46 h6 l-3 5 z" />
        <circle cx="41" cy="38" r="3.2" />
        <circle cx="59" cy="38" r="3.2" />
      </Solid>
      <Body collar="v" />
    </svg>
  );
}

/** 兔 · 一竖一垂双耳 + 门牙 */
export function RabbitIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M41 24 q-9 -28 2 -29 q10 -1 7 29" />
        <ellipse cx="50" cy="44" rx="23" ry="21" />
        {/* 门牙 */}
        <path d="M46 55 h8 v7 q-4 2.5 -8 0 z" />
      </g>
      {/* 垂耳填黑（原站同款黑耳兔） */}
      <path d="M60 26 q16 -14 21 -4 q4 10 -12 14" fill={STROKE} stroke="none" />
      <Solid>
        <circle cx="42" cy="42" r="3.2" />
        <circle cx="58" cy="42" r="3.2" />
        <circle cx="50" cy="50" r="3.2" />
      </Solid>
      <Fine>
        <path d="M44 22 q-4 -18 1 -20" />
      </Fine>
      <Body collar="round" />
    </svg>
  );
}

/** 熊 · 高领毛衣（致敬原站毛衣熊） */
export function BearIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <circle cx="30" cy="21" r="9.5" />
        <circle cx="70" cy="21" r="9.5" />
        <ellipse cx="50" cy="41" rx="26" ry="23" />
        <ellipse cx="50" cy="51" rx="10" ry="7.5" />
      </g>
      <Solid>
        <ellipse cx="50" cy="47.5" rx="5" ry="3.8" />
        <circle cx="41" cy="36" r="3.3" />
        <circle cx="59" cy="36" r="3.3" />
      </Solid>
      <Fine>
        <path d="M50 51 v4" />
      </Fine>
      <Body collar="turtle" />
    </svg>
  );
}

/** 猪 · 大鼻拱 + 卷耳 */
export function PigIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M33 25 q-7 -15 4 -19 q9 -2 11 9" />
        <path d="M67 25 q7 -15 -4 -19 q-9 -2 -11 9" />
        <ellipse cx="50" cy="42" rx="25" ry="22" />
        <ellipse cx="50" cy="52" rx="12" ry="8.5" />
      </g>
      <Solid>
        <circle cx="45.5" cy="52" r="2.3" />
        <circle cx="54.5" cy="52" r="2.3" />
        <circle cx="40" cy="37" r="3.2" />
        <circle cx="60" cy="37" r="3.2" />
      </Solid>
      <Fine>
        <path d="M34 48 q3 3 6 2 M66 48 q-3 3 -6 2" />
      </Fine>
      <Body collar="round" />
    </svg>
  );
}

/** 熊猫 · 环纹眼斑 + 黑肩 */
export function PandaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <Solid>
        <circle cx="29" cy="21" r="10" />
        <circle cx="71" cy="21" r="10" />
      </Solid>
      <ellipse cx="50" cy="41" rx="25" ry="22" {...COMMON} />
      <Solid>
        <ellipse cx="40" cy="39" rx="6.5" ry="9" transform="rotate(-14 40 39)" />
        <ellipse cx="60" cy="39" rx="6.5" ry="9" transform="rotate(14 60 39)" />
        <ellipse cx="50" cy="51" rx="5" ry="3.8" />
      </Solid>
      <g fill="#ffffff" stroke="none">
        <circle cx="41" cy="37" r="2.4" />
        <circle cx="59" cy="37" r="2.4" />
      </g>
      <Fine>
        <path d="M50 55 q0 4 -5 5 M50 55 q0 4 5 5" />
      </Fine>
      <Body collar="round" fill={STROKE} />
    </svg>
  );
}

/** 企鹅 · 白脸黑背 + 燕尾白胸 */
export function PenguinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <ellipse cx="50" cy="40" rx="23" ry="25" fill={STROKE} stroke="none" />
      <path d="M50 24 q-17 -1 -17 18 q0 17 17 21 q17 -4 17 -21 q0 -19 -17 -18" fill="#ffffff" stroke="none" />
      <Solid>
        <circle cx="42" cy="39" r="3" />
        <circle cx="58" cy="39" r="3" />
        <path d="M45 47 q5 -4 10 0 q-5 7 -10 0" />
      </Solid>
      <Body collar="round" fill={STROKE} />
      {/* 燕尾白胸 */}
      <ellipse cx="50" cy="90" rx="17" ry="13" fill="#ffffff" stroke="none" />
    </svg>
  );
}

/** 鳄鱼 · 长吻侧伸（全人群唯一纯侧脸，原站同款） */
export function AlligatorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        {/* 眼凸（头顶） */}
        <circle cx="29" cy="20" r="7.5" />
        {/* 后颅 */}
        <ellipse cx="36" cy="38" rx="20" ry="17" />
        {/* 长吻（向右水平伸出） */}
        <path d="M42 32 q36 -7 48 4 q9 9 -3 14 l-45 5 q-9 -1 -9 -11 q0 -9 9 -12" />
      </g>
      <Solid>
        <circle cx="29" cy="20" r="3" />
        <circle cx="82" cy="40" r="1.8" />
        <circle cx="89" cy="41" r="1.8" />
      </Solid>
      <Fine>
        {/* 吻线 + 两颗下牙 + 眼后棘 */}
        <path d="M52 50 q20 3 34 -1" />
        <path d="M60 52 v5 M71 51 v5" />
        <path d="M40 16 l4 5 M48 18 l4 5" />
      </Fine>
      <Body collar="round" />
    </svg>
  );
}

/** 猫头鹰 · 大眼圈 + 胸羽波浪纹 */
export function OwlIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M34 25 L30 7 q11 2 16 10" />
        <path d="M66 25 L70 7 q-11 2 -16 10" />
        <ellipse cx="50" cy="40" rx="24" ry="22" />
        <circle cx="40" cy="38" r="10" />
        <circle cx="60" cy="38" r="10" />
      </g>
      <Solid>
        <circle cx="40" cy="38" r="3.8" />
        <circle cx="60" cy="38" r="3.8" />
        <path d="M50 45 l-4 6 h8 z" />
      </Solid>
      <Body collar="round" />
      <Fine>
        {/* 胸羽两排波浪 */}
        <path d="M36 82 q4 -4 8 0 q4 4 8 0 M48 82 q4 -4 8 0 q4 4 8 0" />
        <path d="M42 90 q4 -4 8 0 q4 4 8 0" />
      </Fine>
    </svg>
  );
}

/** 奶牛 · 小角 + 鼻板 + 头斑肩斑 */
export function CowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M31 25 q-11 -3 -9 -17 q9 2 13 11" />
        <path d="M69 25 q11 -3 9 -17 q-9 2 -13 11" />
        <ellipse cx="50" cy="40" rx="24" ry="21" />
        <ellipse cx="50" cy="54" rx="14" ry="9" />
      </g>
      <Solid>
        <path d="M40 22 q8 -6 14 0 q-2 8 -7 8 q-6 -1 -7 -8" />
        <circle cx="41" cy="38" r="3.2" />
        <circle cx="59" cy="38" r="3.2" />
        <circle cx="44" cy="54" r="2.6" />
        <circle cx="56" cy="54" r="2.6" />
      </Solid>
      <Body collar="round" />
      <Solid>
        <path d="M30 84 q8 -4 13 2 q-2 8 -9 7 q-6 -2 -4 -9" />
      </Solid>
    </svg>
  );
}

/** 狐狸 · 尖耳内廓 + 尖吻侧伸 + 白领巾 */
export function FoxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M34 26 L30 6 q12 3 17 12" />
        {/* 窄脸 */}
        <path d="M50 62 q-18 -4 -21 -20 q-2 -14 8 -19 q13 -6 26 0 q10 5 8 19 q-3 16 -21 20" />
        {/* 尖吻（向右伸出） */}
        <path d="M56 44 q14 -2 17 4 q2 7 -7 9 l-12 2 q-6 -1 -6 -7 q0 -7 8 -8" />
      </g>
      {/* 右耳填黑（原站同款黑耳狐） */}
      <path d="M66 26 L70 6 q-12 3 -17 12" fill={STROKE} stroke="none" />
      <Fine>
        <path d="M35 21 l-1.5 -8 q5 2 7 6 M65 21 l1.5 -8 q-5 2 -7 6" />
      </Fine>
      <Solid>
        <circle cx="71" cy="47" r="3.8" />
        <circle cx="42" cy="36" r="3.2" />
        <circle cx="57" cy="35" r="2.9" />
      </Solid>
      {/* 白领巾胸毛 */}
      <path d="M42 68 q8 6 16 0 l-3 12 q-5 3 -10 0 z" {...COMMON} />
      <Body collar="round" />
    </svg>
  );
}

/** 机器人 · 方头 + 天线 + 单眼大镜头（致敬原站机器人） */
export function RobotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" style={{ strokeWidth: 'var(--hl-sw, 3.2)' }}>
      <g {...COMMON}>
        <path d="M50 18 v-9" fill="none" />
        <rect x="27" y="18" width="46" height="40" rx="9" />
        <rect x="19" y="32" width="8" height="13" rx="3" />
        <rect x="73" y="32" width="8" height="13" rx="3" />
        {/* 单眼大镜头外圈 */}
        <circle cx="50" cy="37" r="11" />
      </g>
      <Solid>
        <circle cx="50" cy="6" r="4" />
        <circle cx="50" cy="37" r="6.5" />
      </Solid>
      <circle cx="52.5" cy="34.5" r="2" fill="#ffffff" stroke="none" />
      <Fine>
        <path d="M40 51 h20 M45 51 v4 M55 51 v4" />
      </Fine>
      {/* 梯形金属肩 + 领口螺栓 */}
      <g {...COMMON}>
        <path d="M26 102 l4 -24 q20 -8 40 0 l4 24" />
      </g>
      <Solid>
        <circle cx="38" cy="82" r="1.8" />
        <circle cx="62" cy="82" r="1.8" />
      </Solid>
    </svg>
  );
}

/**
 * 滑板狗 · 登录卡 logo（原站同款：小狗踩滑板）
 * 2026-09-08 Claude·侧视全身像：身体 / 头 / 垂耳 / 翘尾 / 腿收两笔，
 *   滑板长条 + 双轮；仅用于 CrowdLogin 卡片顶部（角色 v2 不重画 logo）。
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
      {/* 鼻 + 眼 + 轮 */}
      <g fill={STROKE} stroke="none">
        <circle cx="97" cy="35" r="3.6" />
        <circle cx="86" cy="31" r="2.6" />
        <circle cx="34" cy="92" r="5" />
        <circle cx="86" cy="92" r="5" />
      </g>
    </svg>
  );
}
