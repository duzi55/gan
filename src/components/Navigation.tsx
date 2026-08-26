import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

interface NavigationProps {
  links?: NavLink[];
  brand?: string;
  showFooter?: boolean;
}

const defaultLinks: NavLink[] = [
  { href: "/", label: "首页" },
  { href: "/gallery", label: "图片流" },
];

/**
 * 可复用导航组件 — 支持头部 sticky 模式和页脚模式
 */
export function Navigation({
  links = defaultLinks,
  brand = "NOTES",
  showFooter = false,
}: NavigationProps) {
  if (showFooter) {
    return (
      <footer className="border-t border-zinc-200/70">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8 text-xs text-zinc-400">
          <span>© 2026 {brand}</span>
          <nav className="flex items-center gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-zinc-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span className="font-mono">Next.js</span>
        </div>
      </footer>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[#fafafa]/85 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-[15px] font-bold tracking-[0.2em] text-zinc-900 transition-colors hover:text-zinc-500"
        >
          {brand}
        </Link>
        <div className="flex items-center gap-7 text-sm text-zinc-500">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
