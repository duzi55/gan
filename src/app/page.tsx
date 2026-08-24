const posts = [
  {
    date: "2026.08.24",
    title: "从 14 个 UI 组件到一个静态博客",
    desc: "把组件库改造成 GitHub Pages 静态博客的路径记录。",
  },
  {
    date: "2026.08.10",
    title: "极简风格的取舍",
    desc: "留白、字距、分割线——克制背后的设计决策。",
  },
  {
    date: "2026.07.28",
    title: "Tailwind v4 主题配置笔记",
    desc: "用 @theme inline 管理设计变量的实践。",
  },
  {
    date: "2026.07.12",
    title: "组件级样式的边界",
    desc: "为什么每个组件应该有自己的样式文件。",
  },
  {
    date: "2026.06.30",
    title: "把字体变成设计语言",
    desc: "字体的气质，决定了界面的第一印象。",
  },
  {
    date: "2026.06.15",
    title: "不用渐变",
    desc: "把装饰性渐变换成纯色、留白与更细的分割线。",
  },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24">
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <p className="text-[13px] tracking-[0.4em] text-zinc-400">NOTES</p>
        <h1 className="mt-8 font-display text-[2.6rem] leading-[1.25] tracking-wide text-zinc-900 md:text-[3.4rem] md:leading-[1.22]">
          设计、代码
          <br />
          与界面的碎片。
        </h1>
        <p className="mt-8 max-w-xl text-[15px] leading-loose text-zinc-500">
          一个关于设计、前端工程与极简界面的个人笔记。
          写得慢，想得多；博客与组件，都在这里慢慢生长。
        </p>
      </section>

      {/* Posts */}
      <section className="border-t border-zinc-200/70 pt-2">
        <ul className="divide-y divide-zinc-200/70">
          {posts.map((post) => (
            <li key={post.title}>
              <div className="group -mx-4 px-4 py-7 transition-colors hover:bg-stone-100/70">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="font-mono text-[13px] tabular-nums text-zinc-400 sm:w-[7.5rem] sm:shrink-0">
                    {post.date}
                  </span>
                  <div>
                    <h2 className="text-[17px] font-bold leading-snug tracking-wide text-zinc-900">
                      {post.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                      {post.desc}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
