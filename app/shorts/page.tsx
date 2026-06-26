'use client';

import Navbar from '@/components/Navbar';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, Music2, ChevronUp, ChevronDown } from 'lucide-react';
import { VIDEOS } from '@/app/data';

export default function ShortsPage() {
  const shorts = VIDEOS.slice(0, 5);

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 flex justify-center">
        <div className="relative w-full max-w-sm">
          {shorts.map((video, i) => (
            <div key={video.id} className="h-[calc(100vh-56px)] flex items-center justify-center snap-start relative">
              <div className="relative w-full max-w-[360px] aspect-[9/16] bg-black rounded-2xl overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/short${i}/360/640`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm font-medium mb-1">{video.channel}</p>
                  <p className="text-xs text-white/80 line-clamp-2">{video.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Music2 size={14} className="text-white/70" />
                    <span className="text-xs text-white/70 truncate">{video.channel} - Original Audio</span>
                  </div>
                </div>
                {/* Side actions */}
                <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5">
                  {[
                    { icon: <ThumbsUp size={22} />, label: video.likes },
                    { icon: <ThumbsDown size={22} />, label: 'Dislike' },
                    { icon: <MessageCircle size={22} />, label: '1.2K' },
                    { icon: <Share2 size={22} />, label: 'Share' },
                  ].map(({ icon, label }) => (
                    <button key={label} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                        {icon}
                      </div>
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                  <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white">
                    <img src={video.channelAvatar} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
