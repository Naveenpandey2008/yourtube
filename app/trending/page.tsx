'use client';

import Navbar from '@/components/Navbar';
import { Flame } from 'lucide-react';
import { VIDEOS } from '@/app/data';

const TRENDING_TABS = ['Now', 'Music', 'Gaming', 'Movies'];

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-yt-red/10 flex items-center justify-center">
              <Flame size={22} className="text-yt-red" />
            </div>
            <h1 className="text-2xl font-bold">Trending</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-yt-border">
            {TRENDING_TABS.map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  i === 0
                    ? 'border-white text-white'
                    : 'border-transparent text-yt-muted hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Trending list */}
          <div className="space-y-4">
            {VIDEOS.slice(0, 10).map((video, idx) => (
              <a key={video.id} href="/watch" className="flex gap-4 group">
                <span className="text-2xl font-bold text-yt-border w-8 flex-shrink-0 text-right pt-3">
                  {idx + 1}
                </span>
                <div className="relative flex-shrink-0 w-48 aspect-video rounded-xl overflow-hidden bg-yt-surface">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-xs font-bold text-white ${
                    video.duration === 'LIVE' ? 'bg-yt-red' : 'bg-black/80'
                  }`}>
                    {video.duration}
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-white transition-colors mb-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-yt-muted">{video.channel}</p>
                  <p className="text-xs text-yt-muted">{video.views} views · {video.uploadedAt}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
