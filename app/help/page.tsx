'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQS = [
  {
    category: 'Getting Started',
    items: [
      { q: 'How do I upload a video?', a: 'Go to the Upload page by clicking the Upload button in the navbar. Select your video file or paste a video URL, add details like title and description, then click Upload Video.' },
      { q: 'How do I create a channel?', a: 'Click your avatar in the top right corner, then click "Create channel". Fill in your channel name and handle, then click Create.' },
      { q: 'How do I search for videos?', a: 'Use the search bar at the top of the page. Type your search term and press Enter to see results.' },
    ]
  },
  {
    category: 'Account',
    items: [
      { q: 'How do I sign up?', a: 'Go to the Login page and click "Don\'t have an account? Sign up". Fill in your name, email and password to create an account.' },
      { q: 'How do I change my profile?', a: 'Go to Settings from the navbar dropdown. Under the Account section you can edit your channel name, email and profile photo.' },
    ]
  },
  {
    category: 'Videos',
    items: [
      { q: 'What video formats are supported?', a: 'We support MP4, MOV, AVI and MKV formats. The maximum file size is 2GB.' },
      { q: 'How do I delete a video?', a: 'Go to Your Videos page, hover over a video, click the three dots menu and select Delete.' },
      { q: 'How do I save a video to watch later?', a: 'Hover over any video card on the home page, click the three dots menu and select "Save to Watch Later".' },
    ]
  },
  {
    category: 'Subscriptions',
    items: [
      { q: 'How do I subscribe to a channel?', a: 'Open any video and click the Subscribe button below the video title next to the channel name.' },
      { q: 'Where can I see my subscriptions?', a: 'Click Subscriptions in the left sidebar to see all channels you are subscribed to.' },
      { q: 'How do I unsubscribe?', a: 'Go to the Subscriptions page and click the Subscribed button on any channel to unsubscribe.' },
    ]
  },
];

export default function HelpPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = FAQS.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-yt-surface flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Help Center</h1>
              <p className="text-sm text-yt-muted">Find answers to common questions</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-yt-surface border border-yt-border rounded-xl px-4 py-3 mb-8 focus-within:border-blue-400 transition-colors">
            <Search size={18} className="text-yt-muted flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search help articles..."
              className="flex-1 bg-transparent text-sm placeholder-yt-muted focus:outline-none"
            />
          </div>

          <div className="space-y-6">
            {filtered.map(cat => (
              <div key={cat.category}>
                <h2 className="text-xs font-semibold mb-3 text-yt-muted uppercase tracking-wide">{cat.category}</h2>
                <div className="space-y-2">
                  {cat.items.map(item => (
                    <div key={item.q} className="bg-yt-surface2 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenItem(openItem === item.q ? null : item.q)}
                        className="flex items-center justify-between w-full px-4 py-4 text-left"
                      >
                        <span className="text-sm font-medium pr-4">{item.q}</span>
                        {openItem === item.q ? <ChevronUp size={16} className="text-yt-muted flex-shrink-0" /> : <ChevronDown size={16} className="text-yt-muted flex-shrink-0" />}
                      </button>
                      {openItem === item.q && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-yt-muted leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-yt-surface2 rounded-2xl text-center">
            <h2 className="text-base font-semibold mb-2">Still need help?</h2>
            <p className="text-sm text-yt-muted mb-4">Send us your feedback and we will get back to you.</p>
            <a href="/feedback" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-medium transition-colors">
              Send Feedback
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
