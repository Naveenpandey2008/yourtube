'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import CategoryBar from '@/components/CategoryBar';
import VideoGrid from '@/components/VideoGrid';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={`pt-14 transition-all duration-200 ${
        sidebarOpen ? 'lg:pl-64' : 'lg:pl-[72px]'
      }`}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6">
          <CategoryBar />
          <div className="mt-4 pb-16">
            <VideoGrid />
          </div>
        </div>
      </main>
    </div>
  );
}