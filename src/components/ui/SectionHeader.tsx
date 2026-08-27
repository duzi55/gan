/**
 * SectionHeader — 全站统一的区块标题（编辑式）
 * 2026-08-27 Claude·视觉重设计「墨境」：从首页/归档页重复的头部结构中抽离，
 * 解耦复用；含朱砂序数、display 标题与可选右侧动作链接。
 */
export function SectionHeader({
  index,
  title,
  subtitle,
  action,
}: {
  /** 区块序号（如 "01"），等宽朱砂体；不传则不显示 */
  index?: string;
  /** 区块标题（展示字体） */
  title: string;
  /** 副标题说明 */
  subtitle?: string;
  /** 右侧动作链接 */
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {index && <p className="ink-index mb-2">{index}</p>}
        <h2 className="ink-display text-2xl leading-snug text-foreground md:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      </div>

      {action && (
        <a
          href={action.href}
          className="group shrink-0 pb-0.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <span className="ink-underline">{action.label}</span>
          <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      )}
    </div>
  );
}
