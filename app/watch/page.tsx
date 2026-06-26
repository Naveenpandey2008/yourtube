'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal,
  CheckCircle2, Bell, ChevronDown, ChevronUp
} from 'lucide-react';
import Comments from '@/components/Comments';

export default function WatchPage() {
  const [video, setVideo] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.videos.length > 0) {
          const found = id
            ? data.videos.find((v: any) => v._id === id)
            : data.videos[0];
          const current = found || data.videos[0];
          setVideo(current);
          setRelated(data.videos.filter((v: any) => v._id !== current._id));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubscribe = async () => {
    const newSubscribed = !subscribed;
    setSubscribed(newSubscribed);

    if (newSubscribed) {
      await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest',
          channelId: video.channelId || video._id,
          channelName: video.channel,
          channelAvatar: video.channelAvatar,
          subscribers: video.subscribers || 0,
        }),
      });
    } else {
      await fetch(`/api/subscriptions?userId=guest&channelId=${video.channelId || video._id}`, {
        method: 'DELETE',
      });
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return String(views);
  };

  const formatDate = (dateStr: string) => {
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yt-bg">
        <Navbar onMenuClick={() => {}} />
        <main className="pt-14">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <div className="w-full aspect-video rounded-xl shimmer mb-4" />
                <div className="h-6 shimmer rounded w-3/4 mb-3" />
                <div className="h-4 shimmer rounded w-1/2" />
              </div>
              <div className="w-full lg:w-[400px] flex-shrink-0 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-40 aspect-video rounded-lg shimmer flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 shimmer rounded" />
                      <div className="h-3 shimmer rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-yt-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Video not found</p>
          <a href="/" className="text-blue-400 hover:text-blue-300 text-sm">Go to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left: Player + info */}
            <div className="flex-1 min-w-0">

              {/* Video player */}
              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative">
                {video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full h-full"
                    poster={video.thumbnail}
                    autoPlay={false}
                  />
                ) : (
                  <>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Fake player controls overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
                        <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    {/* Bottom controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 pt-8 pb-3">
                      <div className="relative h-1 bg-white/30 rounded-full mb-3 cursor-pointer group">
                        <div className="absolute left-0 top-0 h-full w-1/3 bg-yt-red rounded-full" />
                        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-yt-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-3 text-white text-sm">
                        <svg viewBox="0 0 24 24" fill="white" width="20" height="20" className="cursor-pointer">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg viewBox="0 0 24 24" fill="white" width="20" height="20" className="cursor-pointer">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                        </svg>
                        <span className="flex-1">0:00 / {video.duration || '0:00'}</span>
                        <svg viewBox="0 0 24 24" fill="white" width="20" height="20" className="cursor-pointer">
                          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-lg font-semibold mt-4 leading-snug">{video.title}</h1>

              {/* Channel + actions */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                <div className="flex items-center gap-3 flex-1">
                  {video.channelAvatar ? (
                    <img
                      src={video.channelAvatar}
                      alt={video.channel}
                      style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {video.channel?.[0]?.toUpperCase() || 'C'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{video.channel}</span>
                      {video.verified && <CheckCircle2 size={14} className="text-yt-muted" />}
                    </div>
                    <span className="text-xs text-yt-muted">
                      {video.subscribers || '0'} subscribers
                    </span>
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className={`ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      subscribed
                        ? 'bg-yt-surface text-yt-muted hover:bg-yt-border'
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {subscribed ? (
                      <><Bell size={16} /><span>Subscribed</span><ChevronDown size={14} /></>
                    ) : (
                      <span>Subscribe</span>
                    )}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-yt-surface rounded-full overflow-hidden">
                    <button
                      onClick={() => { setLiked(l => !l); if (disliked) setDisliked(false); }}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-yt-border transition-colors border-r border-yt-border ${liked ? 'text-white' : 'text-yt-text'}`}
                    >
                      <ThumbsUp size={18} className={liked ? 'fill-white' : ''} />
                      <span>{formatViews((video.likes || 0) + (liked ? 1 : 0))}</span>
                    </button>
                    <button
                      onClick={() => { setDisliked(d => !d); if (liked) setLiked(false); }}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-yt-border transition-colors ${disliked ? 'text-white' : 'text-yt-text'}`}
                    >
                      <ThumbsDown size={18} className={disliked ? 'fill-white' : ''} />
                    </button>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-yt-surface rounded-full text-sm font-medium hover:bg-yt-border transition-colors">
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                  <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-yt-surface rounded-full text-sm font-medium hover:bg-yt-border transition-colors">
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                  <button className="p-2 bg-yt-surface rounded-full hover:bg-yt-border transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div
                className="mt-4 bg-yt-surface rounded-xl p-4 cursor-pointer"
                onClick={() => setDescExpanded(e => !e)}
              >
                <div className="flex items-center gap-3 text-sm text-yt-muted mb-2">
                  <span className="font-medium text-white">
                    {formatViews(video.views || 0)} views
                  </span>
                  <span>{formatDate(video.createdAt)}</span>
                  {video.tags?.map((tag: string) => (
                    <span key={tag} className="text-blue-400">#{tag}</span>
                  ))}
                </div>
                <p className={`text-sm leading-relaxed ${descExpanded ? '' : 'line-clamp-2'}`}>
                  {video.description || 'No description provided.'}
                </p>
                <button className="mt-2 text-sm font-semibold flex items-center gap-1">
                  {descExpanded
                    ? <><ChevronUp size={16}/> Show less</>
                    : <><ChevronDown size={16}/> ...more</>
                  }
                </button>
              </div>

              {/* Comments */}
              <Comments videoId={video._id} />
            </div>

            {/* Right: Related videos */}
            <div className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0">
              <h2 className="text-sm font-semibold mb-4 text-yt-muted uppercase tracking-wide">Up next</h2>
              <div className="space-y-3">
                {related.map((v: any) => (
                  <a key={v._id} href={`/watch?id=${v._id}`} className="flex gap-2 group cursor-pointer">
                    <div className="relative w-40 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-yt-surface">
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute bottom-1 right-1 px-1 py-0.5 rounded text-[10px] font-bold text-white ${
                        v.duration === 'LIVE' ? 'bg-yt-red' : 'bg-black/80'
                      }`}>
                        {v.duration || '0:00'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="text-xs font-medium line-clamp-2 leading-snug group-hover:text-white transition-colors">
                        {v.title}
                      </h3>
                      <p className="text-xs text-yt-muted mt-1">{v.channel}</p>
                      <p className="text-xs text-yt-muted">
                        {formatViews(v.views || 0)} views · {formatDate(v.createdAt)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}