'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CheckCircle2, SlidersHorizontal, X } from 'lucide-react';
import { VIDEOS, type Video } from '@/app/data';

const UPLOAD_DATE = ['Any time', 'Last hour', 'Today', 'This week', 'This month', 'This year'];
const DURATION = ['Any duration', 'Under 4 minutes', '4–20 minutes', 'Over 20 minutes'];
const SORT_BY = ['Relevance', 'Upload date', 'View count', 'Rating'];
const TYPE = ['All', 'Video', 'Channel', 'Playlist', 'Live'];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<Video[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [uploadDate, setUploadDate] = useState('Any time');
  const [duration, setDuration] = useState('Any duration');
  const [sortBy, setSortBy] = useState('Relevance');
  const [type, setType] = useState('All');

  useEffect(() => {
    if (!query) {
      setResults(VIDEOS);
      return;
    }
    const q = query.toLowerCase();
    const filtered = VIDEOS.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.channel.toLowerCase().includes(q) ||
      v.tags?.some(t => t.toLowerCase().includes(q))
    );
    setResults(filtered.length ? filtered : VIDEOS);
  }, [query]);

  const activeFilters = [
    uploadDate !== 'Any time' ? uploadDate : null,
    duration !== 'Any duration' ? duration : null,
    sortBy !== 'Relevance' ? sortBy : null,
    type !== 'All' ? type : null,
  ].filter(Boolean);

  const clearFilters = () => {
    setUploadDate('Any time');
    setDuration('Any duration');
    setSortBy('Relevance');
    setType('All');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Result count */}
      <p className="text-sm text-yt-muted mb-4">
        {query ? (
          <>About <span className="text-white font-medium">{results.length.toLocaleString()}</span> results for <span className="text-white font-medium">"{query}"</span></>
        ) : (
          'Showing all videos'
        )}
      </p>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium flex-shrink-0 transition-colors border ${
            showFilters ? 'bg-white text-black border-white' : 'border-yt-border hover:bg-yt-surface text-yt-text'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilters.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
        </button>

        {/* Type chips */}
        {TYPE.map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              type === t ? 'bg-white text-black' : 'bg-yt-surface hover:bg-yt-border text-yt-text'
            }`}
          >
            {t}
          </button>
        ))}

        {/* Active filter tags */}
        {activeFilters.map(f => (
          <span key={f} className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs flex-shrink-0">
            {f}
          </span>
        ))}

        {activeFilters.length > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-yt-muted hover:text-white transition-colors flex-shrink-0"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-yt-surface2 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          {[
            { label: 'Upload date', options: UPLOAD_DATE, value: uploadDate, onChange: setUploadDate },
            { label: 'Duration', options: DURATION, value: duration, onChange: setDuration },
            { label: 'Sort by', options: SORT_BY, value: sortBy, onChange: setSortBy },
          ].map(filter => (
            <div key={filter.label}>
              <p className="text-xs font-semibold text-yt-muted uppercase tracking-wide mb-2">{filter.label}</p>
              <div className="space-y-1">
                {filter.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => filter.onChange(opt)}
                    className={`flex items-center gap-2 w-full text-sm px-2 py-1.5 rounded-lg transition-colors text-left ${
                      filter.value === opt ? 'text-white font-medium' : 'text-yt-muted hover:text-white'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                      filter.value === opt ? 'border-white bg-white' : 'border-yt-border'
                    }`}>
                      {filter.value === opt && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-sm text-yt-muted max-w-sm">
            Try different keywords or remove search filters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map(video => (
            <a key={video.id} href="/watch" className="flex gap-4 group">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0 w-44 sm:w-64 aspect-video rounded-xl overflow-hidden bg-yt-surface">
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

              {/* Info */}
              <div className="flex-1 min-w-0 py-1">
                <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors mb-2">
                  {video.title}
                </h3>
                <p className="text-xs text-yt-muted mb-2">
                  {video.views} views · {video.uploadedAt}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={video.channelAvatar}
                    alt={video.channel}
                    style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span className="text-xs text-yt-muted flex items-center gap-1">
                    {video.channel}
                    {video.verified && <CheckCircle2 size={11} />}
                  </span>
                </div>
                <p className="text-xs text-yt-muted line-clamp-2 hidden sm:block">
                  {video.description || 'Click to watch this video and discover more amazing content from this creator.'}
                </p>
                {video.tags && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {video.tags.map(tag => (
                      <span key={tag} className="text-xs text-blue-400">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14">
        <Suspense fallback={
          <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-64 aspect-video rounded-xl shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-1/4" />
                  <div className="h-3 shimmer rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        }>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
}