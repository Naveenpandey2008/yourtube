'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Flag, CheckCircle2, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Bug report',
  'Feature request',
  'Content issue',
  'Performance issue',
  'Other',
];

export default function FeedbackPage() {
  const [category, setCategory] = useState('Bug report');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-yt-surface flex items-center justify-center">
              <Flag size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Send Feedback</h1>
              <p className="text-sm text-yt-muted">Help us improve YourTube</p>
            </div>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center text-center py-16 gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold">Thank you for your feedback!</h2>
              <p className="text-sm text-yt-muted">Your feedback helps us make YourTube better.</p>
              <button
                onClick={() => { setSubmitted(false); setFeedback(''); setEmail(''); }}
                className="px-4 py-2 bg-yt-surface hover:bg-yt-border rounded-full text-sm font-medium transition-colors"
              >
                Send more feedback
              </button>
            </div>
          ) : (
            <div className="bg-yt-surface2 rounded-2xl p-6 space-y-5">

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        category === cat ? 'bg-white text-black' : 'bg-yt-surface hover:bg-yt-border text-yt-text'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Feedback <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Describe your feedback in detail..."
                  rows={5}
                  maxLength={1000}
                  className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
                <p className="text-xs text-yt-muted mt-1 text-right">{feedback.length}/1000</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
                />
                <p className="text-xs text-yt-muted mt-1">We'll only use this to follow up on your feedback</p>
              </div>

              {/* Screenshot note */}
              <div className="flex items-start gap-3 p-3 bg-yt-surface rounded-xl">
                <span className="text-xl">💡</span>
                <p className="text-xs text-yt-muted leading-relaxed">
                  Tip: If you're reporting a bug, include steps to reproduce it and what you expected to happen.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!feedback.trim() || loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Send Feedback
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
