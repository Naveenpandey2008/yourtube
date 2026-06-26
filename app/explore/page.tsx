'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Filter, CheckCircle2 } from 'lucide-react';
import { VIDEOS } from '@/app/data';

const FILTERS = ['Upload date', 'Type', 'Duration', 'Features', 'Sort by'];

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yt-surface rounded-lg text-sm flex-shrink-0">
              <Filter size={16} />
              <span>Filters</span>
            </div>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(activeFilter === f ? null : f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeFilter === f ? 'bg-white text-black' : 'bg-yt-surface hover:bg-yt-border text-yt-text'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="space-y-4">
            {VIDEOS.map(video => (
              <a key={video.id} href="/watch" className="flex gap-4 group">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-48 sm:w-64 aspect-video rounded-xl overflow-hidden bg-yt-surface">
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

                {/* Info */}
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors mb-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-yt-muted mb-1">{video.views} views · {video.uploadedAt}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={video.channelAvatar} alt={video.channel} width={20} height={20} className="rounded-full" />
                    <span className="text-xs text-yt-muted flex items-center gap-1">
                      {video.channel}
                      {video.verified && <CheckCircle2 size={11} />}
                    </span>
                  </div>
                  <p className="text-xs text-yt-muted line-clamp-2">
                    {video.description || 'Click to watch this video and discover more amazing content from this creator.'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
