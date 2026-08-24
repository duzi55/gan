import PortfolioCarousel3D from "@/components/ui-components/PortfolioCarousel3D";

export const metadata = {
  title: "Portfolio Carousel",
};

export default function PortfolioCarouselPage() {
  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-12">
      {/* Header */}
      <div className="pt-14 pb-6 text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Portfolio Carousel
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Hover the folder to fan out the cards. Click a card to focus.
        </p>
      </div>

      {/* 3D Carousel */}
      <PortfolioCarousel3D />

      {/* Footer info */}
      <div className="px-6 pb-16 pt-6 text-center">
        <p className="text-xs text-zinc-400">
          Inspired by{" "}
          <a
            href="https://yufeiyang171.github.io/yang-mini-portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-zinc-600"
          >
            yang-mini-portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
