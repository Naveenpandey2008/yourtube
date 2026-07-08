'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Download, Trash2, Play, Crown, Lock } from 'lucide-react';

interface DownloadItem {
  _id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  downloadDate: string;
  plan: string;
}

const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  bronze: 5,
  silver: 15,
  gold: 999,
};

const PLAN_COLORS: Record<string, string> = {
  free: 'text-gray-400',
  bronze: 'text-orange-400',
  silver: 'text-gray-300',
  gold: 'text-yellow-400',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [userPlan] = useState('free'); // Will come from auth later

  useEffect(() => {
    fetch('/api/downloads?userId=guest')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDownloads(data.downloads);
          setTodayCount(data.todayCount);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/downloads?id=${id}`, { method: 'DELETE' });
    setDownloads(prev => prev.filter(d => d._id !== id));
  };

  const limit = PLAN_LIMITS[userPlan] || 1;
  const remaining = Math.max(0, limit - todayCount);

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yt-surface flex items-center justify-center">
                <Download size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Downloads</h1>
                <p className="text-sm text-yt-muted">{downloads.length} downloaded videos</p>
              </div>
            </div>
            <a href="/subscription" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
              <Crown size={16} />
              Upgrade Plan
            </a>
          </div>

          {/* Plan info bar */}
          <div className="bg-yt-surface2 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown size={18} className={PLAN_COLORS[userPlan]} />
                <span className={`font-semibold capitalize ${PLAN_COLORS[userPlan]}`}>
                  {userPlan} Plan
                </span>
              </div>
              <span className="text-sm text-yt-muted">
                {remaining} download{remaining !== 1 ? 's' : ''} remaining today
              </span>
            </div>
            <div className="h-2 bg-yt-border rounded-full overflow-hidden">
              <div
                className="h-full bg-yt-red rounded-full transition-all"
                style={{ width: `${(todayCount / limit) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-yt-muted">{todayCount} used today</span>
              <span className="text-xs text-yt-muted">{limit} daily limit</span>
            </div>

            {/* Plan comparison */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[
                { plan: 'free', limit: 1, price: 'Free' },
                { plan: 'bronze', limit: 5, price: '₹99/mo' },
                { plan: 'silver', limit: 15, price: '₹199/mo' },
                { plan: 'gold', limit: '∞', price: '₹499/mo' },
              ].map(p => (
                <div
                  key={p.plan}
                  className={`p-3 rounded-xl text-center border transition-all ${
                    userPlan === p.plan
                      ? 'border-yt-red bg-yt-red/10'
                      : 'border-yt-border hover:border-yt-muted'
                  }`}
                >
                  <Crown size={16} className={`mx-auto mb-1 ${PLAN_COLORS[p.plan]}`} />
                  <p className={`text-xs font-bold capitalize ${PLAN_COLORS[p.plan]}`}>{p.plan}</p>
                  <p className="text-xs text-yt-muted mt-0.5">{p.limit} downloads/day</p>
                  <p className="text-xs font-medium mt-1">{p.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Loading */}
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

          {/* Empty state */}
          {!loading && downloads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-yt-surface flex items-center justify-center mb-4">
                <Download size={28} className="text-yt-muted" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No downloads yet</h2>
              <p className="text-sm text-yt-muted mb-4">
                Download videos to watch them offline
              </p>
              <a href="/" className="px-4 py-2 bg-yt-surface hover:bg-yt-border rounded-full text-sm font-medium transition-colors">
                Browse videos
              </a>
            </div>
          )}

          {/* Downloads list */}
          {!loading && downloads.length > 0 && (
            <div className="space-y-4">
              {downloads.map((item, index) => (
                <div key={item._id} className="flex gap-4 group">
                  <span className="text-sm text-yt-muted w-5 flex-shrink-0 pt-3 text-right">{index + 1}</span>
                  <a href={`/watch?id=${item.videoId}`} className="relative flex-shrink-0 w-40 aspect-video rounded-xl overflow-hidden bg-yt-surface">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      {item.duration || '0:00'}
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={24} fill="white" className="text-white" />
                    </div>
                  </a>
                  <div className="flex-1 min-w-0 py-1">
                    <a href={`/watch?id=${item.videoId}`}>
                      <h3 className="text-sm font-medium line-clamp-2 hover:text-white transition-colors mb-1">{item.title}</h3>
                    </a>
                    <p className="text-xs text-yt-muted">{item.channel}</p>
                    <p className="text-xs text-yt-muted mt-1">Downloaded: {formatDate(item.downloadDate)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Crown size={11} className={PLAN_COLORS[item.plan]} />
                      <span className={`text-xs capitalize ${PLAN_COLORS[item.plan]}`}>{item.plan} plan</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
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
