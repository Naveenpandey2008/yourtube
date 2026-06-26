'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { ThumbsUp, Trash2 } from 'lucide-react';

interface LikedVideo {
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

export default function LikedVideosPage() {
  const [videos, setVideos] = useState<LikedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now show empty state - likes will be saved when we add auth
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-yt-surface flex items-center justify-center">
              <ThumbsUp size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Liked Videos</h1>
              <p className="text-sm text-yt-muted">{videos.length} videos</p>
            </div>
          </div>

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
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

          {!loading && videos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-yt-surface flex items-center justify-center mb-4">
                <ThumbsUp size={28} className="text-yt-muted" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No liked videos yet</h2>
              <p className="text-sm text-yt-muted mb-4">Videos you like will appear here</p>
              <a href="/" className="px-4 py-2 bg-yt-surface hover:bg-yt-border rounded-full text-sm font-medium transition-colors">
                Browse videos
              </a>
            </div>
          )}

          {!loading && videos.length > 0 && (
            <div className="space-y-4">
              {videos.map((video, index) => (
                <div key={video._id} className="flex gap-4 group">
                  <span className="text-sm text-yt-muted w-5 flex-shrink-0 pt-3 text-right">{index + 1}</span>
                  <a href={`/watch?id=${video.videoId}`} className="relative flex-shrink-0 w-40 aspect-video rounded-xl overflow-hidden bg-yt-surface">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      {video.duration || '0:00'}
                    </div>
                  </a>
                  <div className="flex-1 min-w-0 py-1">
                    <a href={`/watch?id=${video.videoId}`}>
                      <h3 className="text-sm font-medium line-clamp-2 hover:text-white transition-colors mb-1">{video.title}</h3>
                    </a>
                    <p className="text-xs text-yt-muted">{video.channel}</p>
                    <p className="text-xs text-yt-muted">{formatViews(video.views)} views</p>
                  </div>
                  <button
                    onClick={() => setVideos(prev => prev.filter(v => v._id !== video._id))}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 h-fit mt-1 rounded-full hover:bg-yt-surface flex-shrink-0"
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
