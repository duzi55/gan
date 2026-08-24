'use client';

import React from 'react';
import { motion } from 'motion/react';

interface MusicPlayerProps {
  albumTitle: string;
  artist: string;
  year: number;
  songCount: number;
  albumCover?: string;
  onPlay?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ albumTitle, artist, year, songCount, albumCover, onPlay }) => {
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
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-8 right-8 opacity-60" width="80" height="40" viewBox="0 0 80 40"><ellipse cx="25" cy="25" rx="20" ry="12" fill="white" /><ellipse cx="45" cy="20" rx="18" ry="10" fill="white" /><ellipse cx="60" cy="25" rx="12" ry="8" fill="white" /></svg>
        <svg className="absolute top-20 left-12 opacity-40" width="60" height="30" viewBox="0 0 60 30"><ellipse cx="20" cy="18" rx="15" ry="8" fill="white" /><ellipse cx="35" cy="15" rx="12" ry="7" fill="white" /></svg>
      </div>
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-8">
          <motion.button className="flex items-center gap-2 bg-white/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span className="text-sm font-medium text-white">Back</span>
          </motion.button>
          <div className="flex gap-2">
            <motion.button className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
            </motion.button>
            <motion.button className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </motion.button>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg border border-white/30 flex-shrink-0">
            {albumCover ? <img src={albumCover} alt={albumTitle} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-blue-300 to-cyan-300" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white mb-1 leading-tight">{albumTitle}</h2>
            <p className="text-white/80 text-sm mb-2">{artist}</p>
            <p className="text-xs text-white/60">Album · {year} · {songCount} Songs</p>
          </div>
        </div>
        <motion.button
          className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white ml-auto"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlay}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </motion.button>
      </div>
    </motion.div>
  );
};