'use client';

import React from 'react';
import { motion } from 'motion/react';

interface WeatherCardProps {
  temperature: number;
  description: string;
  time: string;
  date: string;
  location: string;
  airQuality: number;
  airQualityLabel: string;
  cloudCover: number;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ temperature, description, time, date, location, airQuality, airQualityLabel, cloudCover }) => {
  return (
    <motion.div
      className="w-full min-w-[260px] max-w-[420px] rounded-[28px] overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, #4A90D9 0%, #7AB8E8 30%, #A8D8F0 60%, #D4EAF7 80%, #F5F3EE 100%)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' as const }}
    >
      <div className="absolute top-8 left-8">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400 shadow-lg shadow-yellow-400/50"></div>
      </div>
      <div className="absolute top-16 right-10 opacity-70">
        <svg width="50" height="25" viewBox="0 0 50 25"><ellipse cx="15" cy="15" rx="12" ry="8" fill="white" /><ellipse cx="28" cy="12" rx="10" ry="6" fill="white" /><ellipse cx="38" cy="15" rx="7" ry="5" fill="white" /></svg>
      </div>
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span className="text-sm text-white font-medium">{location}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-300" />
          </div>
        </div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-start">
              <span className="text-6xl font-light text-white leading-none">{temperature}</span>
              <span className="text-2xl text-white/80 mt-1">°</span>
            </div>
            <p className="text-sm text-white/80 mt-1">{description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">{time}</p>
            <p className="text-sm text-white/80">{date}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-white/80">Air Quality Index</p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{airQuality}</p>
            <p className="text-xs text-white/80">{airQualityLabel}</p>
            <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full" style={{ width: `${airQuality}%` }} />
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-white/80">Cloud Cover</p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{cloudCover}%</p>
            <p className="text-xs text-white/80">Clean</p>
            <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/60 rounded-full" style={{ width: `${cloudCover}%` }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};