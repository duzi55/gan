"use client";

import React, { useRef, useState, useCallback } from "react";
import "./PortfolioCarousel3D.css";

interface FolderCard {
  id: number;
  image: string;
  label: string;
  title: string;
  w: number;
  h: number;
  color: string;
  openX: number;
  openY: number;
  openR: number;
  openScale: number;
  peekX: number;
  peekY: number;
  peekR: number;
  z: number;
  delay: number;
}

const assetPath = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${p}`;

const folderCards: FolderCard[] = [
  { id: 1, image: assetPath("/portfolio-cards/A_vibrant_graphic_design_poste_2026-08-24T00-39-32.png"), label: "SKATER", title: "Style Frame", w: 248, h: 278, color: "#ff5438", openX: -300, openY: 66, openR: -16, openScale: 1.05, peekX: -60, peekY: 50, peekR: -10, z: 1, delay: 0 },
  { id: 2, image: assetPath("/portfolio-cards/A_bright_lime_green_graphic_de_2026-08-24T00-39-37.png"), label: "youth", title: "Visual Poster", w: 254, h: 266, color: "#a6dc39", openX: -200, openY: 18, openR: -7, openScale: 1.07, peekX: -37, peekY: 50, peekR: -8, z: 3, delay: 34 },
  { id: 3, image: assetPath("/portfolio-cards/A_sky_blue_gradient_card_with__2026-08-24T00-39-48.png"), label: "IP ACTION", title: "Character Shot", w: 244, h: 244, color: "#3188df", openX: -52, openY: -10, openR: -2, openScale: 1.07, peekX: -13, peekY: 50, peekR: -1, z: 4, delay: 68 },
  { id: 4, image: assetPath("/portfolio-cards/A_dark_navy_blue_portfolio_car_2026-08-24T00-39-37.png"), label: "PORTFOLIO", title: "Design System", w: 264, h: 274, color: "#12b8ad", openX: 60, openY: -4, openR: 4, openScale: 1.07, peekX: 15, peekY: 50, peekR: 1, z: 5, delay: 102 },
  { id: 5, image: assetPath("/portfolio-cards/A_dark_charcoal_card_featuring_2026-08-24T00-39-42.png"), label: "Characters", title: "3D Study", w: 240, h: 226, color: "#a8dc36", openX: 200, openY: 24, openR: 8, openScale: 1.06, peekX: 38, peekY: 50, peekR: 2, z: 3, delay: 136 },
  { id: 6, image: assetPath("/portfolio-cards/A_bright_green_card_with_pixel_2026-08-24T00-39-40.png"), label: "PUPLOOP", title: "Game Study", w: 244, h: 288, color: "#7946e8", openX: 300, openY: 72, openR: 12, openScale: 0.96, peekX: 57, peekY: 50, peekR: 3, z: 1, delay: 170 },
];

const hovering = (card: FolderCard) => ({
  "--open-scale": card.openScale * 1.1,
}) as React.CSSProperties;

const cardStyle = (card: FolderCard): React.CSSProperties =>
  ({
    "--peek-x": `${card.peekX}px`,
    "--peek-y": `${card.peekY}px`,
    "--peek-r": `${card.peekR}deg`,
    "--open-x": `${card.openX}px`,
    "--open-y": `${card.openY}px`,
    "--open-r": `${card.openR}deg`,
    "--open-scale": card.openScale,
    "--card-delay": `${card.delay}ms`,
    "--card-color": card.color,
    "--card-z": card.z,
    width: card.w,
    height: card.h,
  }) as React.CSSProperties;

export default function PortfolioCarousel3D() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const leaveTimer = useRef<number | null>(null);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const activeId = hoveredId ?? selectedId;

  const handleCardEnter = (id: number) => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setHoveredId(id);
  };

  const handleCardLeave = () => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
    }
    leaveTimer.current = window.setTimeout(() => {
      setHoveredId(null);
      leaveTimer.current = null;
    }, 160);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const dt = Date.now() - touchStart.current.time;

    if (absDx < 30 && absDy < 30 && dt < 300) {
      setIsExpanded(prev => !prev);
    } else if (absDx > 50 && absDx > absDy * 1.5) {
      if (!isExpanded) setIsExpanded(true);
      const currentIdx = selectedId !== null
        ? folderCards.findIndex(c => c.id === selectedId)
        : -1;
      if (dx > 0) {
        const nextIdx = currentIdx <= 0 ? folderCards.length - 1 : currentIdx - 1;
        setSelectedId(folderCards[nextIdx].id);
      } else {
        const nextIdx = currentIdx >= folderCards.length - 1 ? 0 : currentIdx + 1;
        setSelectedId(folderCards[nextIdx].id);
      }
    }
    touchStart.current = null;
  };

  const handleCardClick = (id: number) => {
    if (!isExpanded) {
      setIsExpanded(true);
      setSelectedId(id);
    } else {
      setSelectedId(prev => prev === id ? null : id);
    }
  };

  const cycleCard = useCallback((dir: 'prev' | 'next') => {
    setIsExpanded(true);
    setSelectedId(prevId => {
      const currentIdx = prevId !== null
        ? folderCards.findIndex(c => c.id === prevId)
        : -1;
      if (dir === 'prev') {
        const nextIdx = currentIdx <= 0 ? folderCards.length - 1 : currentIdx - 1;
        return folderCards[nextIdx].id;
      } else {
        const nextIdx = currentIdx >= folderCards.length - 1 ? 0 : currentIdx + 1;
        return folderCards[nextIdx].id;
      }
    });
  }, []);

  return (
    <div className="carousel-container relative w-full h-[600px] sm:h-[780px] lg:h-[840px] flex items-center justify-center select-none overflow-hidden">
      {/* Background rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-[0.15]" viewBox="0 0 800 600" fill="none">
          <ellipse cx="400" cy="300" rx="360" ry="210" stroke="url(#rg1)" strokeWidth="45" strokeLinecap="round" />
          <ellipse cx="380" cy="280" rx="290" ry="170" stroke="url(#rg2)" strokeWidth="32" strokeLinecap="round" transform="rotate(-12 380 280)" />
          <ellipse cx="420" cy="320" rx="230" ry="140" stroke="url(#rg3)" strokeWidth="26" strokeLinecap="round" transform="rotate(8 420 320)" />
          <defs>
            <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#dbeafe" /><stop offset="50%" stopColor="#bfdbfe" /><stop offset="100%" stopColor="#e0f2fe" /></linearGradient>
            <linearGradient id="rg2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e0f2fe" /><stop offset="100%" stopColor="#dbeafe" /></linearGradient>
            <linearGradient id="rg3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#bfdbfe" /><stop offset="100%" stopColor="#e0f2fe" /></linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating tags */}
      <div className="absolute top-[9%] left-[5%] sm:left-[12%] px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-600 shadow-sm animate-float-slow pointer-events-none">ui design</div>
      <div className="absolute top-[14%] right-[7%] sm:right-[15%] px-3 py-1.5 bg-lime-300/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 shadow-sm animate-float-slow pointer-events-none" style={{ animationDelay: "1s" }}>youth</div>
      <div className="absolute bottom-[28%] left-[4%] sm:left-[10%] px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-600 shadow-sm animate-float-slow pointer-events-none" style={{ animationDelay: "2s" }}>comment</div>
      <div className="absolute top-[7%] right-[30%] sm:right-[32%] px-3 py-1.5 bg-pink-200/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm animate-float-slow pointer-events-none" style={{ animationDelay: "0.5s" }}>7/29</div>

      {/* Nav buttons */}
      <button className="carousel-nav-btn left" onClick={() => cycleCard('prev')} aria-label="Previous card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button className="carousel-nav-btn right" onClick={() => cycleCard('next')} aria-label="Next card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

      {/* Portfolio folder */}
      <div className="relative z-10 scale-[0.58] sm:scale-[0.82] lg:scale-100" style={{ transformOrigin: "center center" }}>
        <div
          className={`portfolio-folder${isExpanded ? " is-expanded" : ""}`}
          role="group"
          aria-label="Portfolio folder"
          tabIndex={0}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="folder-shell absolute inset-0">
            <div className="folder-back" />

            <div className="folder-card-stack">
              {folderCards.map((card) => (
                <div
                  key={card.id}
                  className={`folder-card${activeId === card.id ? " is-hovered" : ""}`}
                  style={{
                    ...cardStyle(card),
                    ...(activeId === card.id ? hovering(card) : {}),
                  }}
                  onMouseEnter={() => handleCardEnter(card.id)}
                  onMouseLeave={handleCardLeave}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className="folder-card-inner">
                    <img src={card.image} alt={card.label} draggable={false} />
                    <span className="folder-card-label">{card.label}</span>
                    <span className="folder-card-title">{card.title}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="folder-front">
              <div className="absolute top-4 left-6 flex items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-white/85 flex items-center justify-center text-base shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                </div>
                <span className="text-[9px] font-black tracking-[0.18em] text-white/90 uppercase drop-shadow">Portfolio</span>
              </div>
              <div className="absolute top-4 right-6">
                <div className="relative w-10 h-12">
                  <svg viewBox="0 0 48 56" className="w-full h-full" fill="none">
                    <path d="M24 0C10.745 0 0 10.745 0 24c0 10.5 6.7 19.4 16 22.8V56l8-6 8 6v-9.2c9.3-3.4 16-12.3 16-22.8C48 10.745 37.255 0 24 0z" fill="rgba(255,255,255,0.92)" stroke="rgba(180,180,180,0.4)" strokeWidth="1" />
                    <text x="24" y="20" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="800" fontFamily="sans-serif">GOOD</text>
                    <text x="24" y="32" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="800" fontFamily="sans-serif">IDEA</text>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-5 left-6">
                <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">Yang mini</h2>
              </div>
              <div className="absolute bottom-5 right-6 w-10 h-10 rounded-full flex items-center justify-center border border-white/40 bg-white/25">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] sm:text-xs text-gray-400 font-medium pointer-events-none whitespace-nowrap">
        {isExpanded ? "Swipe to browse \u00b7 Tap card to focus" : "Hover / Tap folder to fan out cards"}
      </div>
    </div>
  );
}
