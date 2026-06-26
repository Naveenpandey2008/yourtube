'use client';

import {
  Home, Compass, PlaySquare, Radio, History, ListVideo,
  Video, Clock, ThumbsUp, Flame, Music2, Gamepad2,
  Newspaper, Trophy, Lightbulb, ChevronRight, Settings,
  HelpCircle, Flag
} from 'lucide-react';
import { SUBSCRIPTIONS } from '@/app/data';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { icon: Home, label: 'Home', href: '/', active: true },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: PlaySquare, label: 'Shorts', href: '/shorts' },
  { icon: Radio, label: 'Subscriptions', href: '/subscriptions' },
];

const LIBRARY_ITEMS = [
  { icon: History, label: 'History', href: '/history' },
  { icon: ListVideo, label: 'Playlists', href: '/playlists' },
  { icon: Video, label: 'Your videos', href: '/your-videos' },
  { icon: Clock, label: 'Watch later', href: '/watch-later' },
  { icon: ThumbsUp, label: 'Liked videos', href: '/liked' },
];

const EXPLORE_ITEMS = [
  { icon: Flame, label: 'Trending', href: '/trending' },
  { icon: Music2, label: 'Music', href: '/music' },
  { icon: Gamepad2, label: 'Gaming', href: '/gaming' },
  { icon: Newspaper, label: 'News', href: '/news' },
  { icon: Trophy, label: 'Sports', href: '/sports' },
  { icon: Lightbulb, label: 'Learning', href: '/learning' },
];

const MINI_NAV = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: PlaySquare, label: 'Shorts', href: '/shorts' },
  { icon: Radio, label: 'Subscriptions', href: '/subscriptions' },
  { icon: Video, label: 'Library', href: '/library' },
];

function NavItem({
  icon: Icon, label, href, active, badge
}: {
  icon: React.ElementType; label: string; href: string; active?: boolean; badge?: boolean
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-4 px-3 py-2 rounded-xl text-sm font-medium transition-colors group ${
        active
          ? 'bg-yt-surface text-white'
          : 'text-yt-text hover:bg-yt-surface'
      }`}
    >
      <Icon size={20} className={active ? 'text-white' : 'text-yt-text group-hover:text-white'} />
      <span className="flex-1">{label}</span>
      {badge && <span className="w-2 h-2 rounded-full bg-yt-red" />}
    </a>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mini sidebar (always visible on desktop when closed) */}
      <aside className={`fixed left-0 top-14 bottom-0 z-30 flex-col items-center py-4 gap-1 w-[72px] hidden transition-all duration-200 ${
        !isOpen ? 'lg:flex' : 'hidden'
      }`}>
        {MINI_NAV.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl w-14 text-center hover:bg-yt-surface transition-colors group ${
              label === 'Home' ? 'bg-yt-surface' : ''
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] leading-tight">{label}</span>
          </a>
        ))}
      </aside>

      {/* Full sidebar */}
      <aside className={`fixed left-0 top-14 bottom-0 z-40 w-64 bg-yt-bg overflow-y-auto scrollbar-hide transition-transform duration-200 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'
      }`}>
        <div className="py-3 px-2">
          {/* Main nav */}
          <nav className="space-y-0.5">
            {NAV_ITEMS.map(item => (
              <NavItem key={item.label} {...item} />
            ))}
          </nav>

          <div className="my-3 border-t border-yt-border" />

          {/* You section */}
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">You</span>
            <ChevronRight size={16} className="text-yt-muted" />
          </div>
          <nav className="space-y-0.5">
            {LIBRARY_ITEMS.map(item => (
              <NavItem key={item.label} {...item} />
            ))}
          </nav>

          <div className="my-3 border-t border-yt-border" />

          {/* Subscriptions */}
          <div className="px-3 mb-2">
            <span className="text-sm font-semibold">Subscriptions</span>
          </div>
          <div className="space-y-0.5">
            {SUBSCRIPTIONS.map(sub => (
              <a
                key={sub.name}
                href="#"
                className="flex items-center gap-4 px-3 py-2 rounded-xl hover:bg-yt-surface transition-colors group"
              >
                <div className="relative">
                  <img
                    src={sub.avatar}
                    alt={sub.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  {sub.live && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-yt-red rounded-full border-2 border-yt-bg" />
                  )}
                </div>
                <span className="text-sm text-yt-text group-hover:text-white transition-colors truncate flex-1">
                  {sub.name}
                </span>
                {sub.live && (
                  <span className="text-[10px] font-bold text-yt-red">LIVE</span>
                )}
              </a>
            ))}
          </div>

          <div className="my-3 border-t border-yt-border" />

          {/* Explore */}
          <div className="px-3 mb-2">
            <span className="text-sm font-semibold">Explore</span>
          </div>
          <nav className="space-y-0.5">
            {EXPLORE_ITEMS.map(item => (
              <NavItem key={item.label} {...item} />
            ))}
          </nav>

          <div className="my-3 border-t border-yt-border" />

          {/* Footer */}
          <nav className="space-y-0.5">
            <NavItem icon={Settings} label="Settings" href="/settings" />
            <NavItem icon={HelpCircle} label="Help" href="/help" />
            <NavItem icon={Flag} label="Send feedback" href="/feedback" />
          </nav>

          <div className="px-3 mt-4 text-[11px] text-yt-muted leading-relaxed">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {['About', 'Press', 'Copyright', 'Contact us', 'Creators', 'Advertise', 'Developers'].map(l => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
            <p className="mt-3">© 2025 YourTube Clone</p>
          </div>
          <div className="h-6" />
        </div>
      </aside>
    </>
  );
}
