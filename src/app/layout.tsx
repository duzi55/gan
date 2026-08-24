import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Notes",
    template: "%s · Notes",
  },
  description: "设计、代码与界面的碎片——一个关于设计、前端工程与极简界面的个人博客。",
};

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/components/", label: "组件" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[#fafafa]/85 backdrop-blur">
          <nav className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-6">
            <Link
              href="/"
              className="text-[15px] font-bold tracking-[0.2em] text-zinc-900 transition-colors hover:text-zinc-500"
            >
              NOTES
            </Link>
            <div className="flex items-center gap-7 text-sm text-zinc-500">
              {navLinks.map((link) => (
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

        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-200/70">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-8 text-xs text-zinc-400">
            <span>© 2026 Notes</span>
            <span className="font-mono">Next.js</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
