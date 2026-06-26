'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Video, Upload, Trash2, Pencil, MoreVertical } from 'lucide-react';

interface VideoItem {
  _id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  duration: string;
  createdAt: string;
  category: string;
}

function formatViews(views: number): string {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return String(views || 0);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export default function YourVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success) setVideos(data.videos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      setVideos(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
    setMenuOpen(null);
  };

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yt-surface flex items-center justify-center">
                <Video size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Your Videos</h1>
                <p className="text-sm text-yt-muted">{videos.length} videos</p>
              </div>
            </div>
            <a href="/upload" className="flex items-center gap-2 px-4 py-2 bg-yt-red hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors">
              <Upload size={16} /> Upload
            </a>
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
                <Video size={28} className="text-yt-muted" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No videos yet</h2>
              <p className="text-sm text-yt-muted mb-4">Upload your first video to get started</p>
              <a href="/upload" className="px-4 py-2 bg-yt-red hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors">
                Upload Video
              </a>
            </div>
          )}

          {!loading && videos.length > 0 && (
            <div className="space-y-4">
              {videos.map(video => (
                <div key={video._id} className="flex gap-4 group">
                  <a href={`/watch?id=${video._id}`} className="relative flex-shrink-0 w-40 aspect-video rounded-xl overflow-hidden bg-yt-surface">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      {video.duration || '0:00'}
                    </div>
                  </a>
                  <div className="flex-1 min-w-0 py-1">
                    <a href={`/watch?id=${video._id}`}>
                      <h3 className="text-sm font-medium line-clamp-2 hover:text-white transition-colors mb-1">{video.title}</h3>
                    </a>
                    <p className="text-xs text-yt-muted">{video.category}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-yt-muted">
                      <span>{formatViews(video.views)} views</span>
                      <span>{formatViews(video.likes)} likes</span>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setMenuOpen(menuOpen === video._id ? null : video._id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-yt-surface transition-all mt-1"
                    >
                      <MoreVertical size={16} className="text-yt-muted" />
                    </button>
                    {menuOpen === video._id && (
                      <div className="absolute right-0 top-8 w-44 bg-yt-surface border border-yt-border rounded-xl shadow-2xl overflow-hidden z-20">
                        <a href={`/watch?id=${video._id}`} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors">
                          <Pencil size={15} className="text-yt-muted" /> Edit
                        </a>
                        <button onClick={() => handleDelete(video._id)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors text-red-400">
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
