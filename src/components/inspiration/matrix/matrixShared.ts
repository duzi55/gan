/**
 * matrixShared.ts —— IN-08 黑客桌面：配色 / 虚拟文件系统 / 终端命令 / 文案（单一数据源）
 * 2026-09-09 Claude·新增（用户口述灵感：黑客帝国一样的桌面——细线条、绿色，
 *   有文件夹、可打开终端）：
 *   - MX 配色常量：矩阵绿细线主题（舞台 / 窗口 / 文字共用一套口径）；
 *   - MX_FOLDERS / RABBIT_FILE：桌面虚拟文件系统（纯前端演示数据，
 *     无后端、无网络请求；文案为黑客帝国趣味致敬）；
 *   - runTerminalCommand：纯函数命令执行器（help / ls / cat / whoami /
 *     date / matrix / rabbit）；clear / exit 属窗口行为，由 TerminalPane 拦截；
 *   - RAIN_GLYPHS / RAIN_MESSAGES / WAKE_LINES：代码雨字库（半角片假名 +
 *     数字）、屏保浮现名言、唤醒终端台词，供 DigitalRain / MatrixRain /
 *     MatrixWake 复用（解耦铁律）。
 *   - 被矩阵桌面前端组件（MatrixDesktop / variants）统一引用。
 */

/** 矩阵绿细线主题（组件内联样式统一从这里取色，保证同一口径） */
export const MX = {
  /** 舞台深黑绿底（与 registry.MATRIX_STAGE 渐变同系） */
  bg: '#020806',
  /** 正文字绿 */
  green: '#4ade80',
  /** 高亮字（标题 / 亮头字符） */
  greenBright: '#bbf7d0',
  /** 极亮字（代码雨亮头 / 唤醒闪字） */
  greenGlow: '#e8fff2',
  /** 细线主色：1px 边框 / 分隔线 */
  line: 'rgba(74,222,128,0.42)',
  /** 更弱细线：内网格 / 次级分隔 */
  lineSoft: 'rgba(74,222,128,0.16)',
  /** 文字辉光（终端 / 名言标题） */
  textGlow: '0 0 8px rgba(74,222,128,0.45)',
} as const;

/** 虚拟文件系统中的单个文件（body 为纯展示正文，非接口数据） */
export interface MxFile {
  name: string;
  /** 窗口 / 文件列表里的副标注 */
  note: string;
  body: string;
}

/** 虚拟文件夹（桌面图标 → 双击打开 → 文件列表 → 点击文件查看正文） */
export interface MxFolder {
  id: string;
  label: string;
  hint: string;
  files: MxFile[];
}

/**
 * 桌面虚拟文件夹 ×3（纯前端演示数据，文案为黑客帝国趣味致敬）
 * 2026-09-09 Claude·新增
 */
export const MX_FOLDERS: MxFolder[] = [
  {
    id: 'scripts',
    label: '脚本库',
    hint: '装载程序',
    files: [
      {
        name: 'construct.sh',
        note: '建筑程序',
        body:
          '# 建筑程序（Construct）\n装载完成。\n\n这里没有勺子。\n会弯曲的不是勺子，是你自己。',
      },
      {
        name: 'jump_program.sh',
        note: '跳跃程序',
        body:
          '# 跳跃程序\n第一次都会摔。\n摔过这一次之后——\n你什么都能跳。',
      },
      {
        name: 'dodge_bullets.sh',
        note: '子弹躲避',
        body:
          '# 子弹躲避\n起跑线前不要怕，先生。\n你已经听过枪声了。\n——不，我不打算躲。',
      },
    ],
  },
  {
    id: 'logs',
    label: '系统日志',
    hint: '追踪记录',
    files: [
      {
        name: 'trace_1999.log',
        note: '追踪报告',
        body:
          '[TRACE] trace program: running\n[TRACE] 信号源：电话线 555-0690\n[TRACE] 定位失败。\n[TRACE] 他不在系统里，也不在电话线里。',
      },
      {
        name: 'anomaly.dat',
        note: '异常报告',
        body:
          '[ANOMALY] 残余自选码（self-actualizing codes）\n[ANOMALY] 关联身份：anderson_t\n[ANOMALY] 备注：他就像狂风中的一根线。',
      },
    ],
  },
  {
    id: 'incoming',
    label: '投递区',
    hint: '锡安通讯',
    files: [
      {
        name: 'zion_call.txt',
        note: '锡安来电',
        body:
          'ZION → 555-0690\n坐标已锁定。\n站着别动，我们会找到你。\n——崔妮蒂',
      },
      {
        name: 'oracle_msg.txt',
        note: '先知留言',
        body:
          '先知留言：\n想不想吃块饼干？\n等你吃完，你才会相信自己。',
      },
    ],
  },
];

/** 桌面散置文件：white_rabbit.txt（不属于任何文件夹，cat / 点击可直接读） */
export const RABBIT_FILE: MxFile = {
  name: 'white_rabbit.txt',
  note: '跟着白兔',
  body:
    '跟着白兔。\n\n现在，看你的右肩——\n别找了，兔子已经跑过去了。\n\n（纹身那一位，就是你的入口。）',
};

/**
 * 全 VFS 找文件（cat 命令与查看窗口共用）：文件夹文件 + 桌面散置文件
 */
export function findFile(name: string): MxFile | undefined {
  const lower = name.toLowerCase();
  if (lower === 'white_rabbit.txt') return RABBIT_FILE;
  for (const f of MX_FOLDERS) {
    const hit = f.files.find((x) => x.name.toLowerCase() === lower);
    if (hit) return hit;
  }
  return undefined;
}

/** 终端帮助文案（help 命令输出） */
export const MX_HELP = [
  '可用命令：',
  '  help        显示本帮助',
  '  ls          列出全部文件夹与文件',
  '  cat <file>  查看文件（如 cat construct.sh）',
  '  whoami      我是谁',
  '  date        系统时间',
  '  matrix      ？',
  '  rabbit      ？',
  '  clear       清屏',
  '  exit        关闭终端',
].join('\n');

/** matrix 命令彩蛋横幅 */
export const MX_BANNER = [
  ' _____ _____ _____ _____ _____ _____ ',
  '|     |   __|_   _|  |  |   __|_   _|',
  '|   --|__   |_| | |    -|   __| | |  ',
  '|_____|_____| |_| |__|__|_____| |_|  ',
  '        T H E   M A T R I X   H A S   Y O U',
].join('\n');

/**
 * 终端命令执行器（纯函数，无副作用；clear / exit 由 TerminalPane 拦截处理）
 * 2026-09-09 Claude·新增
 */
export function runTerminalCommand(raw: string): string {
  const input = raw.trim();
  if (!input) return '';
  const [cmd, ...rest] = input.split(/\s+/);
  const arg = rest.join(' ').toLowerCase();

  switch (cmd.toLowerCase()) {
    case 'help':
      return MX_HELP;
    case 'ls':
      return MX_FOLDERS.map(
        (f) => `${f.label}/\n${f.files.map((x) => `  ${x.name}`).join('\n')}`,
      ).join('\n') + `\n  ${RABBIT_FILE.name}`;
    case 'cat': {
      if (!arg) return '用法：cat <file>（先 ls 看看有什么）';
      const file = findFile(arg);
      return file ? file.body : `cat: ${arg}: 没有那个文件`;
    }
    case 'whoami':
      return 'neo / thomas_a.anderson\n身份：残余自选码 · 等级：救世主（未认证）';
    case 'date':
      return new Date().toLocaleString('zh-CN', { hour12: false });
    case 'matrix':
      return MX_BANNER;
    case 'rabbit':
      return 'Follow the white rabbit.';
    default:
      return `${cmd}: 命令未找到（试试 help）`;
  }
}

/** 代码雨字库：半角片假名 + 数字（黑客帝国原版视觉） */
export const RAIN_GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾅﾆﾇﾈﾉ0123456789';

/** 屏保轮换浮现名言（MatrixRain 变体；Knock 一句留给唤醒彩蛋） */
export const RAIN_MESSAGES = [
  'The Matrix has you.',
  'Follow the white rabbit.',
  'Wake up, Neo...',
] as const;

/** 唤醒终端台词（MatrixWake 变体，1999-03-31 影院开场字幕致敬） */
export const WAKE_LINES = [
  '> Call trans opt: received. 2-19-98 13:24:18 REC:Log>',
  '> Trace program: running',
  '',
  'Wake up, Neo...',
  'The Matrix has you...',
  'Follow the white rabbit.',
  '',
  '> Knock, knock, Neo.',
] as const;
