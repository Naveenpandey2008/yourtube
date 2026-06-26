'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Radio, Bell } from 'lucide-react';
import { VIDEOS } from '@/app/data';

interface Subscription {
  _id: string;
  channelId: string;
  channelName: string;
  channelAvatar: string;
  subscribers: number;
  createdAt: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/subscriptions?userId=guest')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSubscriptions(data.subscriptions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUnsubscribe = async (channelId: string) => {
    await fetch(`/api/subscriptions?userId=guest&channelId=${channelId}`, {
      method: 'DELETE',
    });
    setSubscriptions(prev => prev.filter(s => s.channelId !== channelId));
  };

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-yt-surface flex items-center justify-center">
              <Radio size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Subscriptions</h1>
              <p className="text-sm text-yt-muted">{subscriptions.length} channels</p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4">
                  <div className="w-16 h-16 rounded-full shimmer" />
                  <div className="h-3 shimmer rounded w-20" />
                  <div className="h-3 shimmer rounded w-16" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && subscriptions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-yt-surface flex items-center justify-center mb-4">
                <Radio size={28} className="text-yt-muted" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No subscriptions yet</h2>
              <p className="text-sm text-yt-muted mb-4">
                Subscribe to channels to see them here
              </p>
              <a
                href="/"
                className="px-4 py-2 bg-yt-surface hover:bg-yt-border rounded-full text-sm font-medium transition-colors"
              >
                Browse videos
              </a>
            </div>
          )}

          {/* Subscribed channels */}
          {!loading && subscriptions.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                {subscriptions.map(sub => (
                  <div key={sub._id} className="flex flex-col items-center gap-2 p-4 bg-yt-surface2 rounded-2xl hover:bg-yt-surface transition-colors">
                    {sub.channelAvatar ? (
                      <img
                        src={sub.channelAvatar}
                        alt={sub.channelName}
                        style={{ width: '64px', height: '64px', minWidth: '64px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
                        {sub.channelName?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <p className="text-sm font-medium text-center line-clamp-1">{sub.channelName}</p>
                    <p className="text-xs text-yt-muted">{sub.subscribers || 0} subscribers</p>
                    <button
                      onClick={() => handleUnsubscribe(sub.channelId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-yt-surface hover:bg-yt-border rounded-full text-xs font-medium transition-colors"
                    >
                      <Bell size={12} />
                      Subscribed
                    </button>
                  </div>
                ))}
              </div>

              {/* Latest videos from subscriptions */}
              <div>
                <h2 className="text-base font-semibold mb-4">Latest videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {VIDEOS.slice(0, 8).map(video => (
                    <a key={video.id} href={`/watch?id=${video.id}`} className="group cursor-pointer">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-surface mb-2">
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
                      <div className="flex gap-2">
                        <img
                          src={video.channelAvatar}
                          alt={video.channel}
                          style={{ width: '32px', height: '32px', minWidth: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h3 className="text-xs font-medium line-clamp-2">{video.title}</h3>
                          <p className="text-xs text-yt-muted mt-0.5">{video.channel}</p>
                          <p className="text-xs text-yt-muted">{video.views} views · {video.uploadedAt}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
