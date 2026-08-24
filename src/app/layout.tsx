import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Notes",
    template: "%s · Notes",
  },
  description: "A minimal blog about design & code",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/components/", label: "Components" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[#fafafa]/85 backdrop-blur">
          <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
            <Link
              href="/"
              className="font-medium tracking-tight text-zinc-900 transition-colors hover:text-zinc-500"
            >
              Notes
            </Link>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
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
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8 text-xs text-zinc-400">
            <span>© 2026 Notes</span>
            <span className="font-mono">Built with Next.js</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
