'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu, Search, Mic, Video, Bell, User, X,
  ChevronLeft, Settings, HelpCircle, LogOut, PlusCircle
} from 'lucide-react';
import CreateChannelDialog from './CreateChannelDialog';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-yt-bg flex items-center px-4 gap-2 border-b border-transparent">
        {!showMobileSearch && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-full hover:bg-yt-surface transition-colors"
            >
              <Menu size={20} />
            </button>
            <a href="/" className="flex items-center gap-1 ml-1 select-none">
              <div className="flex items-center justify-center w-8 h-8 bg-yt-red rounded-lg">
                <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </div>
              <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
                YourTube
              </span>
            </a>
          </div>
        )}

        {showMobileSearch ? (
          <div className="flex items-center gap-2 flex-1">
            <button onClick={() => setShowMobileSearch(false)} className="p-2">
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-1 items-center border border-yt-border rounded-full overflow-hidden bg-yt-surface2 focus-within:border-blue-400">
              <input
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Search"
                className="flex-1 px-4 py-2 bg-transparent text-yt-text placeholder-yt-muted text-sm outline-none"
              />
              {searchValue && (
                <button onClick={() => setSearchValue('')} className="px-2 text-yt-muted hover:text-white">
                  <X size={16} />
                </button>
              )}
              <button onClick={handleSearch} className="px-4 py-2 bg-yt-surface hover:bg-yt-border border-l border-yt-border transition-colors">
                <Search size={18} className="text-yt-muted" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 flex justify-center max-w-2xl mx-auto">
              <div className={`hidden sm:flex items-center border rounded-full overflow-hidden transition-all w-full max-w-xl ${
                searchFocused ? 'border-blue-400 shadow-lg shadow-blue-900/20' : 'border-yt-border'
              } bg-yt-surface2`}>
                {searchFocused && (
                  <Search size={16} className="ml-4 text-yt-muted flex-shrink-0" />
                )}
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder="Search"
                  className="flex-1 px-4 py-2 bg-transparent text-yt-text placeholder-yt-muted text-sm outline-none"
                />
                {searchValue && (
                  <button onClick={() => setSearchValue('')} className="px-2 text-yt-muted hover:text-white flex-shrink-0">
                    <X size={16} />
                  </button>
                )}
                <button onClick={handleSearch} className="px-5 py-2 bg-yt-surface hover:bg-yt-border border-l border-yt-border transition-colors flex-shrink-0">
                  <Search size={18} className="text-yt-muted" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                className="sm:hidden p-2 rounded-full hover:bg-yt-surface transition-colors"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search size={20} />
              </button>
              <button className="hidden sm:flex p-2 rounded-full hover:bg-yt-surface transition-colors">
                <Mic size={20} />
              </button>
              <a href="/upload" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yt-border hover:bg-yt-surface transition-colors text-sm font-medium">
  <Video size={18} />
  <span className="hidden md:block">Upload</span>
</a>
              <button className="relative p-2 rounded-full hover:bg-yt-surface transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yt-red rounded-full" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold ml-1"
                >
                  Y
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-10 w-56 bg-yt-surface border border-yt-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-yt-border">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">Y</div>
                      <div>
                        <p className="text-sm font-medium">Your Channel</p>
                        <p className="text-xs text-yt-muted">@yourchannel</p>
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors"
                      onClick={() => { setShowUserMenu(false); setShowCreateChannel(true); }}
                    >
                      <span className="text-yt-muted"><PlusCircle size={16} /></span>
                      Create channel
                    </button>
                    {[
                      { icon: <User size={16} />, label: 'Your profile', href: '/channel' },
                      { icon: <Settings size={16} />, label: 'Settings', href: '/settings' },
                      { icon: <HelpCircle size={16} />, label: 'Help', href: '/help' },
                      { icon: <User size={16} />, label: 'Sign in', href: '/login' },
                      { icon: <LogOut size={16} />, label: 'Sign out', href: '/' },
                    ].map(item => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span className="text-yt-muted">{item.icon}</span>
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </header>

      <CreateChannelDialog
        isOpen={showCreateChannel}
        onClose={() => setShowCreateChannel(false)}
      />
    </>
  );
}