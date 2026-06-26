'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Clock, Trash2, Play } from 'lucide-react';

interface WatchLaterVideo {
  _id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  views: number;
  createdAt: string;
}

function formatViews(views: number): string {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return String(views || 0);
}

export default function WatchLaterPage() {
  const [videos, setVideos] = useState<WatchLaterVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/watchlater?userId=guest')
      .then(res => res.json())
      .then(data => {
        if (data.success) setVideos(data.videos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRemove = async (videoId: string) => {
    try {
      await fetch(`/api/watchlater?userId=guest&videoId=${videoId}`, { method: 'DELETE' });
      setVideos(prev => prev.filter(v => v.videoId !== videoId));
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await Promise.all(videos.map(v =>
        fetch(`/api/watchlater?userId=guest&videoId=${v.videoId}`, { method: 'DELETE' })
      ));
      setVideos([]);
    } catch (err) {
      console.error('Clear all error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yt-surface flex items-center justify-center">
                <Clock size={20} className="text-yt-text" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Watch Later</h1>
                <p className="text-sm text-yt-muted">{videos.length} videos</p>
              </div>
            </div>
            {videos.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-yt-surface hover:bg-yt-border rounded-full text-sm font-medium transition-colors"
              >
                <Trash2 size={16} />
                Clear all
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-40 aspect-video rounded-xl shimmer flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 shimmer rounded w-3/4" />
                    <div className="h-3 shimmer rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && videos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-yt-surface flex items-center justify-center mb-4">
                <Clock size={28} className="text-yt-muted" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No videos saved yet</h2>
              <p className="text-sm text-yt-muted mb-4">
                Save videos to watch them later
              </p>
              <a
                href="/"
                className="px-4 py-2 bg-yt-surface hover:bg-yt-border rounded-full text-sm font-medium transition-colors"
              >
                Browse videos
              </a>
            </div>
          )}

          {/* Videos list */}
          {!loading && videos.length > 0 && (
            <div className="space-y-4">
              {videos.map((video, index) => (
                <div key={video._id} className="flex gap-4 group">
                  <span className="text-sm text-yt-muted w-5 flex-shrink-0 pt-3 text-right">
                    {index + 1}
                  </span>
                  <a href={`/watch?id=${video.videoId}`} className="relative flex-shrink-0 w-40 aspect-video rounded-xl overflow-hidden bg-yt-surface">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      {video.duration || '0:00'}
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={24} fill="white" className="text-white" />
                    </div>
                  </a>
                  <div className="flex-1 min-w-0 py-1">
                    <a href={`/watch?id=${video.videoId}`}>
                      <h3 className="text-sm font-medium line-clamp-2 hover:text-white transition-colors mb-1">
                        {video.title}
                      </h3>
                    </a>
                    <p className="text-xs text-yt-muted">{video.channel}</p>
                    <p className="text-xs text-yt-muted">{formatViews(video.views)} views</p>
                  </div>
                  <button
                    onClick={() => handleRemove(video.videoId)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 h-fit mt-1 rounded-full hover:bg-yt-surface flex-shrink-0"
                    title="Remove from Watch Later"
                  >
                    <Trash2 size={16} className="text-yt-muted" />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
