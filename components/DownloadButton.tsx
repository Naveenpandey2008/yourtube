'use client';

import { useState } from 'react';
import { Download, CheckCircle2, AlertCircle, Loader2, Crown, X } from 'lucide-react';

interface DownloadButtonProps {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  videoUrl?: string;
}

const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  bronze: 5,
  silver: 15,
  gold: 999,
};

export default function DownloadButton({
  videoId, title, thumbnail, channel, duration, videoUrl
}: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'limit'>('idle');
  const [message, setMessage] = useState('');
  const [remaining, setRemaining] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const userPlan = 'free'; // Will come from auth later

  const handleDownload = async () => {
    setStatus('loading');
    setMessage('');

    try {
      // Register download in DB
      const res = await fetch('/api/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest',
          videoId,
          title,
          thumbnail,
          channel,
          duration,
          plan: userPlan,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setRemaining(data.remaining);
        setMessage(`Download saved! ${data.remaining} download${data.remaining !== 1 ? 's' : ''} remaining today.`);

        // If video URL exists trigger actual download
        if (videoUrl) {
          const a = document.createElement('a');
          a.href = videoUrl;
          a.download = `${title}.mp4`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }

        setTimeout(() => setStatus('idle'), 3000);
      } else if (res.status === 429) {
        setStatus('limit');
        setShowModal(true);
      } else if (res.status === 409) {
        setStatus('error');
        setMessage('Already downloaded today');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Download failed');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Download failed. Try again.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-1">
        <button
          onClick={handleDownload}
          disabled={status === 'loading'}
          className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            status === 'success'
              ? 'bg-green-600/20 text-green-400 border border-green-500/30'
              : status === 'error'
              ? 'bg-red-600/20 text-red-400 border border-red-500/30'
              : status === 'limit'
              ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-yt-surface hover:bg-yt-border text-yt-text'
          }`}
        >
          {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
          {status === 'success' && <CheckCircle2 size={16} />}
          {status === 'error' && <AlertCircle size={16} />}
          {status === 'limit' && <Crown size={16} />}
          {status === 'idle' && <Download size={16} />}

          <span>
            {status === 'loading' ? 'Saving...' :
             status === 'success' ? 'Downloaded!' :
             status === 'error' ? 'Failed' :
             status === 'limit' ? 'Limit reached' :
             'Download'}
          </span>
        </button>

        {message && status !== 'idle' && (
          <p className={`text-xs hidden sm:block ${
            status === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {message}
          </p>
        )}
      </div>

      {/* Limit reached modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-yt-surface2 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown size={20} className="text-yellow-400" />
                <h2 className="text-base font-semibold">Daily limit reached</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-yt-surface transition-colors">
                <X size={16} className="text-yt-muted" />
              </button>
            </div>

            <p className="text-sm text-yt-muted mb-4">
              You have reached your daily download limit for the <span className="text-white font-medium capitalize">{userPlan}</span> plan.
              Upgrade to download more videos!
            </p>

            {/* Plan comparison */}
            <div className="space-y-2 mb-5">
              {[
                { plan: 'free', limit: 1, price: 'Free', color: 'text-gray-400' },
                { plan: 'bronze', limit: 5, price: '₹99/mo', color: 'text-orange-400' },
                { plan: 'silver', limit: 15, price: '₹199/mo', color: 'text-gray-300' },
                { plan: 'gold', limit: 'Unlimited', price: '₹499/mo', color: 'text-yellow-400' },
              ].map(p => (
                <div
                  key={p.plan}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${
                    userPlan === p.plan ? 'bg-yt-border' : 'bg-yt-surface'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Crown size={14} className={p.color} />
                    <span className={`text-sm font-medium capitalize ${p.color}`}>{p.plan}</span>
                    {userPlan === p.plan && <span className="text-xs bg-yt-red px-1.5 py-0.5 rounded text-white">Current</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yt-text">{p.limit} downloads/day</p>
                    <p className="text-xs text-yt-muted">{p.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-yt-surface hover:bg-yt-border rounded-xl text-sm font-medium transition-colors"
              >
                Maybe later
              </button>
              <a
                href="/subscription"
                className="flex-1 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl text-sm font-medium text-center hover:opacity-90 transition-opacity"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
