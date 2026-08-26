'use client';

import React, { useState, useEffect } from 'react';
import { WeatherCard } from './WeatherCard';

const weatherCodes: Record<number, string> = {
  0: '晴朗', 1: '晴朗', 2: '局部多云', 3: '阴天',
  45: '雾', 48: '雾凇',
  51: '毛毛雨', 53: '毛毛雨', 55: '毛毛雨',
  61: '小雨', 63: '中雨', 65: '大雨',
  71: '小雪', 73: '中雪', 75: '大雪',
  77: '冰粒',
  80: '阵雨', 81: '中阵雨', 82: '大阵雨',
  85: '阵雪', 86: '大阵雪',
  95: '雷暴', 96: '雷暴', 99: '大雷暴',
};

interface WeatherData {
  temperature: number;
  description: string;
  time: string;
  date: string;
  location: string;
  airQuality: number;
  airQualityLabel: string;
  cloudCover: number;
}

function formatWeatherData(raw: {
  current: { temperature_2m: number; cloud_cover: number; weather_code: number; wind_speed_10m: number };
}): WeatherData {
  const c = raw.current;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const cloud = c.cloud_cover;

  let aqi = Math.round(cloud);
  let aqiLabel = 'Good';
  if (cloud > 75) { aqiLabel = 'Poor'; }
  else if (cloud > 50) { aqiLabel = 'Moderate'; }
  else if (cloud > 25) { aqiLabel = 'Fair'; }

  return {
    temperature: Math.round(c.temperature_2m),
    description: weatherCodes[c.weather_code] ?? '未知',
    time: `${h}:${m}`,
    date: `${now.getMonth() + 1}月${now.getDate()}日`,
    location: 'Shanghai',
    airQuality: aqi,
    airQualityLabel: aqiLabel,
    cloudCover: cloud,
  };
}

const fallbackData: WeatherData = {
  temperature: 26,
  description: '晴朗',
  time: '14:00',
  date: '8月26日',
  location: 'Shanghai',
  airQuality: 30,
  airQualityLabel: 'Good',
  cloudCover: 15,
};

export function LiveWeatherCard() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=31.23&longitude=121.47&current=temperature_2m,cloud_cover,weather_code,wind_speed_10m&timezone=Asia/Shanghai',
      { signal: controller.signal }
    )
      .then(r => r.json())
      .then(raw => {
        setData(formatWeatherData(raw));
        setLoading(false);
      })
      .catch(() => {
        setData(fallbackData);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  if (loading || !data) {
    return (
      <div
        className="w-full min-w-[260px] max-w-[420px] rounded-[28px] overflow-hidden relative"
        style={{
          background: 'linear-gradient(180deg, #4A90D9 0%, #7AB8E8 30%, #A8D8F0 60%, #D4EAF7 80%, #F5F3EE 100%)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
          minHeight: '320px',
        }}
      >
        <div className="relative z-10 p-6 flex items-center justify-center" style={{ minHeight: '320px' }}>
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading weather...</span>
          </div>
        </div>
      </div>
    );
  }

  return <WeatherCard {...data} />;
}
