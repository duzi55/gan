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
      suppressHydrationWarning
    >
      <head>
        {/* 防闪烁:首帧同步应用已保存的主题(仅当显式存储 dark 才启用深色) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col pb-16 md:pb-0">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Navigation showFooter />
        <MobileNav />
      </body>
    </html>
  );
}
