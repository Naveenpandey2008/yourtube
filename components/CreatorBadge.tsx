'use client';

export default function CreatorBadge() {
  return (
    <a
      href="https://github.com/Naveenpandey2008"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-yt-surface/90 backdrop-blur-sm border border-yt-border text-xs text-yt-muted hover:text-yt-text hover:border-yt-red transition-colors shadow-lg"
    >
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yt-red text-white text-[10px] font-bold">
        N
      </span>
      <span className="hidden sm:inline">Built by Naveen Pandey</span>
    </a>
  );
}