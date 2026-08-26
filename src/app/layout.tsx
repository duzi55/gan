import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/blog/MobileNav";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col pb-16 md:pb-0">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Navigation showFooter />
        <MobileNav />
      </body>
    </html>
  );
}
