'use client';

import { useEffect, useState } from 'react';

/**
 * Fixed reading progress bar at the top of the viewport.
 * Uses transform: scaleX for GPU-friendly animation.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(pct, 1));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-transparent">
      <div
        className="h-full origin-left bg-zinc-800 transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
