'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { CheckCircle2, Search, Bell, ChevronDown, Loader2 } from 'lucide-react';

const CHANNEL_TABS = ['Home', 'Videos', 'Shorts', 'Playlists', 'About'];

export default function ChannelPage() {
  const [activeTab, setActiveTab] = useState('Home');
  const [subscribed, setSubscribed] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch channel from MongoDB
    fetch('/api/channel?userId=guest')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setChannel(data.channel);
        } else {
          // Use default if no channel created yet
          setChannel({
            name: 'Your Channel',
            handle: '@yourchannel',
            description: 'Welcome to your channel! Upload videos to get started.',
            avatar: '',
            banner: '',
            subscribers: 0,
            verified: false,
          });
        }
      })
      .catch(() => {
        setChannel({
          name: 'Your Channel',
          handle: '@yourchannel',
          description: 'Welcome to your channel!',
          avatar: '',
          banner: '',
          subscribers: 0,
          verified: false,
        });
      });

    // Fetch videos from MongoDB
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVideos(data.videos);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatViews = (views: number) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return String(views || 0);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 86400) return 'Today';
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yt-bg flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-yt-muted" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14">

        {/* Banner */}
        <div className="w-full h-32 sm:h-44 lg:h-56 overflow-hidden bg-yt-surface">
          {channel?.banner ? (
            <img src={channel.banner} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-900 to-pink-900" />
          )}
        </div>

        {/* Channel info */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-5">

            {/* Avatar */}
            {channel?.avatar ? (
              <img
                src={channel.avatar}
                alt={channel.name}
                style={{ width: '80px', height: '80px', minWidth: '80px', borderRadius: '50%', objectFit: 'cover' }}
                className="ring-2 ring-yt-border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold flex-shrink-0 ring-2 ring-yt-border">
                {channel?.name?.[0]?.toUpperCase() || 'Y'}
              </div>
            )}

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{channel?.name}</h1>
                {channel?.verified && <CheckCircle2 size={20} className="text-yt-muted" />}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-yt-muted mb-2">
                <span>{channel?.handle}</span>
                <span>·</span>
                <span>{channel?.subscribers || 0} subscribers</span>
                <span>·</span>
                <span>{videos.length} videos</span>
              </div>
              <p className="text-sm text-yt-muted line-clamp-2 max-w-xl mb-3">
                {channel?.description}
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSubscribed(s => !s)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
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
                <button className="p-2 rounded-full bg-yt-surface hover:bg-yt-border transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-yt-border overflow-x-auto scrollbar-hide">
            {CHANNEL_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-white text-white'
                    : 'border-transparent text-yt-muted hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-6">

            {/* HOME TAB */}
            {activeTab === 'Home' && (
              <div className="space-y-8">
                {videos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="text-5xl mb-4">🎬</div>
                    <h2 className="text-lg font-semibold mb-2">No videos yet</h2>
                    <p className="text-sm text-yt-muted mb-4">Upload your first video to get started</p>
                    <a
                      href="/upload"
                      className="px-4 py-2 bg-yt-red hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
                    >
                      Upload Video
                    </a>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-semibold">Latest videos</h2>
                      <button
                        onClick={() => setActiveTab('Videos')}
                        className="text-sm text-yt-muted hover:text-white transition-colors"
                      >
                        See all
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {videos.slice(0, 5).map((v: any) => (
                        <a key={v._id} href={`/watch?id=${v._id}`} className="group cursor-pointer">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-surface mb-2">
                            <img
                              src={v.thumbnail}
                              alt={v.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className={`absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-xs font-bold text-white ${
                              v.duration === 'LIVE' ? 'bg-yt-red' : 'bg-black/80'
                            }`}>
                              {v.duration || '0:00'}
                            </div>
                          </div>
                          <h3 className="text-xs font-medium line-clamp-2 leading-snug">{v.title}</h3>
                          <p className="text-xs text-yt-muted mt-1">
                            {formatViews(v.views)} views · {formatDate(v.createdAt)}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIDEOS TAB */}
            {activeTab === 'Videos' && (
              <div>
                <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide">
                  {['Latest', 'Popular', 'Oldest'].map((s, i) => (
                    <button
                      key={s}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        i === 0 ? 'bg-white text-black' : 'bg-yt-surface hover:bg-yt-border text-yt-text'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {videos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="text-5xl mb-4">🎬</div>
                    <h2 className="text-lg font-semibold mb-2">No videos yet</h2>
                    <a href="/upload" className="px-4 py-2 bg-yt-red hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors">
                      Upload Video
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {videos.map((v: any) => (
                      <a key={v._id} href={`/watch?id=${v._id}`} className="group cursor-pointer">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-surface mb-2">
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className={`absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-xs font-bold text-white ${
                            v.duration === 'LIVE' ? 'bg-yt-red' : 'bg-black/80'
                          }`}>
                            {v.duration || '0:00'}
                          </div>
                        </div>
                        <h3 className="text-xs font-medium line-clamp-2 leading-snug">{v.title}</h3>
                        <p className="text-xs text-yt-muted mt-1">
                          {formatViews(v.views)} views · {formatDate(v.createdAt)}
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SHORTS TAB */}
            {activeTab === 'Shorts' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {videos.slice(0, 6).map((v: any, i: number) => (
                  <a key={v._id} href={`/watch?id=${v._id}`} className="group cursor-pointer">
                    <div className="relative rounded-xl overflow-hidden bg-yt-surface mb-2" style={{ aspectRatio: '9/16' }}>
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xs font-medium line-clamp-2">{v.title}</h3>
                    <p className="text-xs text-yt-muted mt-0.5">{formatViews(v.views)} views</p>
                  </a>
                ))}
              </div>
            )}

            {/* PLAYLISTS TAB */}
            {activeTab === 'Playlists' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">📋</div>
                <h2 className="text-lg font-semibold mb-2">No playlists yet</h2>
                <p className="text-sm text-yt-muted">Create playlists to organize your videos</p>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === 'About' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h2 className="text-base font-semibold mb-3">Description</h2>
                  <p className="text-sm text-yt-muted leading-relaxed">
                    {channel?.description || 'No description provided.'}
                  </p>
                </div>
                <div className="border-t border-yt-border pt-6">
                  <h2 className="text-base font-semibold mb-3">Channel details</h2>
                  <div className="space-y-2 text-sm text-yt-muted">
                    <p>🎯 Handle: {channel?.handle}</p>
                    <p>📅 Joined: {channel?.createdAt ? new Date(channel.createdAt).toLocaleDateString() : 'Recently'}</p>
                    <p>🎬 Videos: {videos.length}</p>
                    <p>👥 Subscribers: {channel?.subscribers || 0}</p>
                    {channel?.category && <p>📁 Category: {channel.category}</p>}
                  </div>
                </div>
                <div className="border-t border-yt-border pt-6">
                  <h2 className="text-base font-semibold mb-3">Stats</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Subscribers', value: channel?.subscribers || 0 },
                      { label: 'Videos', value: videos.length },
                      { label: 'Total views', value: formatViews(videos.reduce((acc: number, v: any) => acc + (v.views || 0), 0)) },
                    ].map(stat => (
                      <div key={stat.label} className="bg-yt-surface rounded-xl p-4 text-center">
                        <p className="text-xl font-bold">{stat.value}</p>
                        <p className="text-xs text-yt-muted mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}