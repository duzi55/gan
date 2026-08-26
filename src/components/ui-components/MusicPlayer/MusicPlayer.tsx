'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const playlist = [
  { title: 'Midnight City', artist: 'M83', duration: 244 },
  { title: 'Resonance', artist: 'Home', duration: 198 },
  { title: 'Nightcall', artist: 'Kavinsky', duration: 252 },
  { title: 'Outro', artist: 'M83', duration: 233 },
  { title: 'Loving Arms', artist: 'Tycho', duration: 207 },
];

interface MusicPlayerProps {
  albumTitle?: string;
  artist?: string;
  year?: number;
  songCount?: number;
  albumCover?: string;
  onPlay?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  albumTitle = 'Lo-fi Beats',
  artist = 'Chillhop Music',
  year = 2026,
  songCount = playlist.length,
  albumCover,
  onPlay,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = playlist[currentTrack];

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setCurrentTrack(t => (t + 1) % playlist.length);
          return 0;
        }
        return p + (100 / (track.duration * 10));
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentTrack, track.duration]);

  const togglePlay = () => {
    setIsPlaying(p => !p);
    onPlay?.();
  };

  const nextTrack = () => {
    setCurrentTrack(t => (t + 1) % playlist.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrack(t => (t - 1 + playlist.length) % playlist.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const currentSec = (track.duration * progress) / 100;

  return (
    <motion.div
      className="w-full min-w-[260px] max-w-[420px] rounded-[28px] overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, #5BA3E6 0%, #87CEEB 40%, #B8E4F9 70%, #F5F3EE 100%)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' as const }}
    >
      {/* Decorative clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-8 right-8 opacity-60" width="80" height="40" viewBox="0 0 80 40">
          <ellipse cx="25" cy="25" rx="20" ry="12" fill="white" />
          <ellipse cx="45" cy="20" rx="18" ry="10" fill="white" />
          <ellipse cx="60" cy="25" rx="12" ry="8" fill="white" />
        </svg>
        <svg className="absolute top-20 left-12 opacity-40" width="60" height="30" viewBox="0 0 60 30">
          <ellipse cx="20" cy="18" rx="15" ry="8" fill="white" />
          <ellipse cx="35" cy="15" rx="12" ry="7" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 p-6">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <motion.button
            className="flex items-center gap-2 bg-white/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevTrack}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span className="text-sm font-medium text-white">Prev</span>
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setCurrentTrack(0); setProgress(0); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </motion.button>
            <motion.button
              className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextTrack}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Album info */}
        <div className="flex gap-4 mb-5">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border border-white/30 flex-shrink-0">
            {albumCover ? (
              <img src={albumCover} alt={albumTitle} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-300 to-cyan-300 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white" opacity="0.5">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h2 className="text-lg font-bold text-white mb-0.5 leading-tight truncate">{track.title}</h2>
            <p className="text-white/80 text-sm mb-1 truncate">{track.artist}</p>
            <p className="text-xs text-white/60">Album · {year} · {songCount} Songs</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, pct)));
            }}
          >
            <div
              className="h-full bg-white/80 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-white/60">
            <span>{formatTime(currentSec)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Play/Pause button */}
        <div className="flex items-center gap-3">
          <motion.button
            className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </motion.button>
          {/* Mini visualizer */}
          <div className="flex items-end gap-0.5 h-8 flex-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-full bg-white/40 transition-all duration-150"
                style={{
                  height: isPlaying ? `${20 + Math.abs(Math.sin(Date.now() / 200 + i * 0.5)) * 60}%` : '4px',
                  animationDelay: `${i * 30}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
