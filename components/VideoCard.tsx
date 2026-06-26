'use client';

import { useState } from 'react';
import { MoreVertical, Clock, ListPlus, Share2, Flag, CheckCircle2 } from 'lucide-react';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    channel: string;
    channelAvatar: string;
    thumbnail: string;
    views: string;
    uploadedAt: string;
    duration: string;
    verified: boolean;
    likes?: string;
    description?: string;
    tags?: string[];
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isLive = video.duration === 'LIVE';

  const handleWatchLater = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch('/api/watchlater', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest',
          videoId: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
          channel: video.channel,
          duration: video.duration,
          views: 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Saved to Watch Later!');
      } else {
        alert('Already in Watch Later!');
      }
    } catch (err) {
      console.error('Watch later error:', err);
    }
    setMenuOpen(false);
  };

  const menuItems = [
    { icon: <Clock size={16} />, label: 'Save to Watch later', action: handleWatchLater },
    { icon: <ListPlus size={16} />, label: 'Save to playlist', action: null },
    { icon: <Share2 size={16} />, label: 'Share', action: null },
    { icon: <Flag size={16} />, label: 'Not interested', action: null },
  ];

  return (
    <div className="group cursor-pointer animate-fade-in">

      {/* Thumbnail */}
      <a href={`/watch?id=${video.id}`} className="block">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-yt-surface mb-3">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 shimmer" />
          )}
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }}
            loading="lazy"
          />
          {imgError && (
            <div className="absolute inset-0 bg-yt-surface flex items-center justify-center">
              <span className="text-yt-muted text-sm">No preview</span>
            </div>
          )}

          {/* Duration badge */}
          <div className={`absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-bold text-white ${
            isLive ? 'bg-yt-red' : 'bg-black/80'
          }`}>
            {video.duration}
          </div>

          {/* Hover play overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
              <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </a>

      {/* Info row */}
      <div className="flex gap-3">
        {/* Channel avatar */}
        <a href="#" className="flex-shrink-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
          <img
            src={video.channelAvatar}
            alt={video.channel}
            style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
        </a>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <a href={`/watch?id=${video.id}`} className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-yt-text line-clamp-2 leading-snug group-hover:text-white transition-colors">
                {video.title}
              </h3>
            </a>

            {/* Context menu button */}
            <div className="relative flex-shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-yt-surface transition-all mt-0.5"
                aria-label="More options"
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-8 w-52 bg-yt-surface border border-yt-border rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-20 animate-fade-in"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {menuItems.map(item => (
                    <button
                      key={item.label}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors text-left"
                      onClick={(e) => {
                        if (item.action) {
                          item.action(e);
                        } else {
                          e.preventDefault();
                          e.stopPropagation();
                          setMenuOpen(false);
                        }
                      }}
                    >
                      <span className="text-yt-muted">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <a href="#" className="flex items-center gap-1 mt-1.5 group/channel" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-yt-muted group-hover/channel:text-white transition-colors">
              {video.channel}
            </span>
            {video.verified && (
              <CheckCircle2 size={12} className="text-yt-muted flex-shrink-0" />
            )}
          </a>

          <p className="text-xs text-yt-muted mt-0.5">
            {video.views} views · {video.uploadedAt}
          </p>
        </div>
      </div>
    </div>
  );
}
