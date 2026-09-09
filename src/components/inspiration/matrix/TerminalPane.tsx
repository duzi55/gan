'use client';

import { useEffect, useRef, useState } from 'react';
import { MX, runTerminalCommand } from './matrixShared';

/**
 * TerminalPane.tsx —— IN-08 终端窗格（黑客桌面终端窗口的内容体）
 * 2026-09-09 Claude·新增：
 *   - 历史行数组 + 输入行：Enter 执行 runTerminalCommand（纯函数，无网络）；
 *     clear / exit 属窗口行为，在本组件拦截（清屏 / 回调关闭）；
 *   - 自动滚动到底部（每次历史变化同步 scrollTop）；
 *   - 点击窗体任意处聚焦输入框（移动端友好）；触屏设备聚焦会弹软键盘，
 *     键盘命令为可选交互——底部状态栏的快捷终端按钮与 help 横幅兜底；
 *   - 光标闪烁用 animate-pulse，reduced-motion 下 motion-reduce:animate-none
 *     退化为静态方块（规则第六条）。
 */

interface TerminalPaneProps {
  /** exit 命令回调：关闭宿主窗口 */
  onExit?: () => void;
}

export default function TerminalPane({ onExit }: TerminalPaneProps) {
  const [lines, setLines] = useState<string[]>([
    'ZION-OS terminal [build 2.19]',
    '输入 help 查看可用命令。',
    '',
  ]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* 历史变化 → 滚到底 */
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = () => {
    const cmd = input;
    setInput('');
    if (!cmd.trim()) {
      setLines((l) => [...l, '']);
      return;
    }
    const lower = cmd.trim().toLowerCase();
    /* 窗口级命令在本组件拦截，不进执行器 */
    if (lower === 'clear') {
      setLines([]);
      return;
    }
    if (lower === 'exit') {
      onExit?.();
      return;
    }
    const out = runTerminalCommand(cmd);
    setLines((l) => [...l, `> ${cmd}`, ...(out ? out.split('\n') : []), '']);
  };

  return (
    <div
      className="cursor-text font-mono text-[12px] leading-[1.7]"
      style={{ color: MX.green }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* 历史输出区：max-h 钳制窗口高度，内部滚动 */}
      <div
        ref={bodyRef}
        className="max-h-[46vh] min-h-[180px] overflow-y-auto whitespace-pre-wrap break-all pr-1"
        style={{ scrollbarWidth: 'thin' }}
      >
        {lines.map((l, i) => (
          <div key={i}>{l || '\u00A0'}</div>
        ))}
        {/* 输入行：提示符 + 受控输入 + 闪烁光标 */}
        <div className="flex items-center gap-1">
          <span style={{ color: MX.greenBright }}>&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
            aria-label="终端命令输入"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 border-none bg-transparent font-mono text-[12px] outline-none"
            style={{ color: MX.greenBright, caretColor: MX.green }}
          />
          <i
            className="h-[14px] w-[7px] shrink-0 animate-pulse motion-reduce:animate-none"
            style={{ background: MX.green }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
