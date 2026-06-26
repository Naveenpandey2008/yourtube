'use client';

import { useState, useEffect, useCallback } from 'react';
import VideoCard from './VideoCard';

interface Video {
  _id: string;
  title: string;
  channel: string;
  channelAvatar: string;
  thumbnail: string;
  views: number;
  createdAt: string;
  duration: string;
  verified: boolean;
  likes: number;
  description?: string;
  tags?: string[];
}

function formatViews(views: number): string {
  if (views >= 1000000) return (views / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(views);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

function SkeletonCard() {
  return (
    <div className="animate-fade-in">
      <div className="w-full aspect-video rounded-xl shimmer mb-3" />
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full shimmer flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 shimmer rounded w-full" />
          <div className="h-3.5 shimmer rounded w-4/5" />
          <div className="h-3 shimmer rounded w-2/5 mt-1" />
          <div className="h-3 shimmer rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

interface VideoGridProps {
  category?: string;
  searchQuery?: string;
}

export default function VideoGrid({ category, searchQuery }: VideoGridProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVideos = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      let url = `/api/videos?page=${pageNum}&limit=12`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      if (category && category !== 'All') url += `&category=${encodeURIComponent(category)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        if (reset || pageNum === 1) {
          setVideos(data.videos);
        } else {
          setVideos(prev => [...prev, ...data.videos]);
        }
        setTotalPages(data.totalPages);
        setPage(pageNum);
      } else {
        setError('Failed to load videos');
      }
    } catch (err) {
      setError('Failed to load videos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, searchQuery]);

  useEffect(() => {
    fetchVideos(1, true);
  }, [fetchVideos]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loadingMore &&
        !loading &&
        page < totalPages
      ) {
        fetchVideos(page + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, loading, page, totalPages, fetchVideos]);

  const toCardFormat = (video: Video) => ({
    id: video._id,
    title: video.title,
    channel: video.channel,
    channelAvatar: video.channelAvatar,
    thumbnail: video.thumbnail,
    views: formatViews(video.views),
    uploadedAt: formatDate(video.createdAt),
    duration: video.duration,
    verified: video.verified,
    likes: formatViews(video.likes),
    description: video.description,
    tags: video.tags,
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-lg font-semibold mb-2">Failed to load videos</h2>
        <p className="text-sm text-yt-muted mb-4">{error}</p>
        <button
          onClick={() => fetchVideos(1, true)}
          className="px-4 py-2 bg-yt-surface hover:bg-yt-border rounded-full text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🎬</div>
        <h2 className="text-lg font-semibold mb-2">No videos found</h2>
        <p className="text-sm text-yt-muted">Try a different category or search term</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map(video => (
          <VideoCard key={video._id} video={toCardFormat(video)} />
        ))}
        {loadingMore && (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={`skel-${i}`} />
            ))}
          </>
        )}
      </div>
      {page < totalPages && !loadingMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchVideos(page + 1)}
            className="px-6 py-2.5 bg-yt-surface hover:bg-yt-border rounded-full text-sm font-medium transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}