'use client';

import React from 'react';
import Link from 'next/link';
import Masonry from 'react-masonry-css';
import { ProductCard } from '@/components/ui-components/ProductCard';
import { BottomNavigation } from '@/components/ui-components/BottomNavigation';
import { NotificationCard } from '@/components/ui-components/NotificationCard';
import { StatsCard } from '@/components/ui-components/StatsCard';
import { FileUploadCard } from '@/components/ui-components/FileUploadCard';
import { ProfileCard } from '@/components/ui-components/ProfileCard';
import { MessageInput } from '@/components/ui-components/MessageInput';
import { SearchBar } from '@/components/ui-components/SearchBar';
import { ServiceCard } from '@/components/ui-components/ServiceCard';
import { HealthCard } from '@/components/ui-components/HealthCard';
import { UserProfile } from '@/components/ui-components/UserProfile';
import { MusicPlayer } from '@/components/ui-components/MusicPlayer';
import { WeatherCard } from '@/components/ui-components/WeatherCard';

// Masonry断点：按窗口宽度分配列数，
// 断点选择须保证该区间最小列宽 ≥ 卡片最小宽度(min-w)，避免卡片溢出。
// 区间内最小列宽估算（页面左右 padding + 24px 列间距）：
//   1列(<768): 360px视口列宽≈328px
//   2列(768~1280): 列宽≈348px
//   3列(1281~1536): 列宽≈379px
//   4列(>1536): 列宽≈342px
const breakpointColumnsObj = {
  default: 4,
  1536: 3,
  1280: 2,
  768: 1,
};

export default function Components() {
  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-16 sm:px-6 lg:px-12">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-7xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          Components
        </h1>
        <p className="mt-4 max-w-md text-base text-zinc-500">
          14 个移动端 UI 组件，全部自建，用作博客的组成零件。
        </p>
        <Link
          href="/components/portfolio-carousel/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900"
        >
          <span>View 3D Portfolio Carousel</span>
          <span>→</span>
        </Link>
      </div>

      {/* Masonry Layout */}
      <div className="max-w-[1800px] mx-auto">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex items-start -ml-6 w-auto"
          columnClassName="pl-6 bg-clip-padding"
        >
          <div className="mb-6">
            <ProductCard title="Crush Contrast" price="€165,95" imageUrl="https://picsum.photos/seed/blueshirt/400/400" />
          </div>

          <div className="mb-6">
            <BottomNavigation items={[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>, label: 'Home', isActive: true },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>, label: 'Explore' },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>, label: 'Cart' },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>, label: 'Saved' },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>, label: 'Profile' },
            ]} />
          </div>

          <div className="mb-6">
            <NotificationCard title="Setup Updates" description="To get the latest update properly, make sure to apply the necessary configurations." />
          </div>

          <div className="mb-6">
            <StatsCard greeting="Good morning" date="December 10, 2025" userName="John" />
          </div>

          <div className="mb-6">
            <FileUploadCard />
          </div>

          <div className="mb-6">
            <ProfileCard name="Chloe Harrison" role="Product designer" tags={['Figma', 'UX Design']} rating={4.5} earned="$15K+" rate="$80/hr" />
          </div>

          <div className="mb-6">
            <MessageInput recipientName="Maya Chen" />
          </div>

          <div className="mb-6">
            <SearchBar />
          </div>

          <div className="mb-6">
            <ServiceCard services={[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>, label: 'Ride', color: 'bg-gradient-to-br from-green-400 to-emerald-500' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path></svg>, label: 'Food', color: 'bg-gradient-to-br from-orange-400 to-red-500' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon></svg>, label: 'Package', color: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon></svg>, label: 'Transit', color: 'bg-gradient-to-br from-purple-400 to-indigo-500' },
            ]} />
          </div>

          <div className="mb-6">
            <HealthCard heartRate={98} distance="8.13 km" calories={768} standHours={5} />
          </div>

          <div className="mb-6">
            <UserProfile name="Jennifer Harrison" status="Last seen recently" bio="Mother of Maggie and Maral." />
          </div>

          <div className="mb-6">
            <MusicPlayer albumTitle="Nothing Was The Same" artist="Drake" year={2013} songCount={16} />
          </div>

          <div className="mb-6">
            <WeatherCard temperature={28} description="Pretty Sunny" time="11:21 AM" date="Feb 2, 2025" location="Calicut, Kerala" airQuality={72} airQualityLabel="Moderate" cloudCover={5} />
          </div>
        </Masonry>
      </div>
    </div>
  );
}
