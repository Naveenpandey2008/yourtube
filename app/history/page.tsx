'use client';

import Navbar from '@/components/Navbar';
import { Search, Trash2, PauseCircle } from 'lucide-react';
import { VIDEOS } from '@/app/data';

export default function HistoryPage() {
  const grouped = {
    'Today': VIDEOS.slice(0, 4),
    'Yesterday': VIDEOS.slice(4, 8),
    'This week': VIDEOS.slice(8, 12),
  };

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between mb-6 gap-6">
            <h1 className="text-2xl font-bold">Watch history</h1>
            <div className="flex flex-col gap-2 text-sm">
              <button className="flex items-center gap-2 text-yt-text hover:text-white transition-colors">
                <Search size={16} />
                <span>Search watch history</span>
              </button>
              <button className="flex items-center gap-2 text-yt-text hover:text-white transition-colors">
                <Trash2 size={16} />
                <span>Clear all watch history</span>
              </button>
              <button className="flex items-center gap-2 text-yt-text hover:text-white transition-colors">
                <PauseCircle size={16} />
                <span>Pause watch history</span>
              </button>
            </div>
          </div>

          {Object.entries(grouped).map(([date, videos]) => (
            <div key={date} className="mb-8">
              <h2 className="text-base font-semibold mb-4 text-yt-muted">{date}</h2>
              <div className="space-y-4">
                {videos.map(video => (
                  <a key={video.id} href="/watch" className="flex gap-4 group">
                    <div className="relative flex-shrink-0 w-40 aspect-video rounded-xl overflow-hidden bg-yt-surface">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute bottom-1 right-1 px-1 py-0.5 rounded text-[10px] font-bold text-white ${
                        video.duration === 'LIVE' ? 'bg-yt-red' : 'bg-black/80'
                      }`}>
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-white transition-colors mb-1">
                        {video.title}
                      </h3>
                      <p className="text-xs text-yt-muted">{video.channel}</p>
                      <p className="text-xs text-yt-muted">{video.views} views · {video.uploadedAt}</p>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-fit mt-1 rounded-full hover:bg-yt-surface"
                      onClick={(e) => { e.preventDefault(); }}
                    >
                      <Trash2 size={16} className="text-yt-muted" />
                    </button>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
