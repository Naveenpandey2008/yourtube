'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, SkipBack, Settings, ChevronRight,
  Loader2
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onEnded?: () => void;
  nextVideo?: { title: string; thumbnail: string; id: string };
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoPlayer({ src, poster, title, onEnded, nextVideo }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<NodeJS.Timeout>();

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [showNextVideo, setShowNextVideo] = useState(false);
  const [doubleTapSide, setDoubleTapSide] = useState<'left' | 'right' | null>(null);
  const [doubleTapCount, setDoubleTapCount] = useState(0);
  const lastTap = useRef<{ side: string; time: number }>({ side: '', time: 0 });

  // Hide controls after inactivity
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    return () => { if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current); };
  }, []);

  // Video event handlers
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.buffered.length > 0) {
      setBuffered(video.buffered.end(video.buffered.length - 1));
    }
    // Show next video 10 seconds before end
    if (nextVideo && video.duration - video.currentTime <= 10 && video.duration > 0) {
      setShowNextVideo(true);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) { setDuration(video.duration); setLoading(false); }
  };

  const handleWaiting = () => setLoading(true);
  const handleCanPlay = () => setLoading(false);

  const handleEnded = () => {
    setPlaying(false);
    setShowControls(true);
    onEnded?.();
  };

  // Play / Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) { video.pause(); setPlaying(false); }
    else { video.play(); setPlaying(true); resetHideTimer(); }
  };

  // Volume
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  // Seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), duration);
  };

  // Fullscreen
  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    if (!fullscreen) {
      await container.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Playback speed
  const handlePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ': case 'k': e.preventDefault(); togglePlay(); break;
        case 'ArrowRight': case 'l': skip(10); break;
        case 'ArrowLeft': case 'j': skip(-10); break;
        case 'ArrowUp': setVolume(v => Math.min(v + 0.1, 1)); break;
        case 'ArrowDown': setVolume(v => Math.max(v - 0.1, 0)); break;
        case 'm': toggleMute(); break;
        case 'f': toggleFullscreen(); break;
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [playing, muted, fullscreen]);

  // Mobile double tap
  const handleTap = (side: 'left' | 'right') => {
    const now = Date.now();
    if (lastTap.current.side === side && now - lastTap.current.time < 300) {
      skip(side === 'right' ? 10 : -10);
      setDoubleTapSide(side);
      setDoubleTapCount(c => c + 1);
      setTimeout(() => { setDoubleTapSide(null); setDoubleTapCount(0); }, 800);
    }
    lastTap.current = { side, time: now };
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
        onClick={togglePlay}
        playsInline
      />

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 size={40} className="text-white animate-spin" />
        </div>
      )}

      {/* Mobile double tap zones */}
      <div className="absolute inset-0 flex pointer-events-none sm:hidden">
        <div className="flex-1 pointer-events-auto" onDoubleClick={() => handleTap('left')} onClick={togglePlay} />
        <div className="flex-1 pointer-events-auto" onDoubleClick={() => handleTap('right')} onClick={togglePlay} />
      </div>

      {/* Double tap animation */}
      {doubleTapSide && (
        <div className={`absolute top-1/2 -translate-y-1/2 ${doubleTapSide === 'left' ? 'left-8' : 'right-8'} flex flex-col items-center gap-1 pointer-events-none`}>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            {doubleTapSide === 'right'
              ? <SkipForward size={28} className="text-white" />
              : <SkipBack size={28} className="text-white" />
            }
          </div>
          <span className="text-white text-xs font-bold">{doubleTapSide === 'right' ? '+' : '-'}10s</span>
        </div>
      )}

      {/* Next video card */}
      {showNextVideo && nextVideo && !playing && (
        <div className="absolute bottom-20 right-4 bg-black/90 rounded-xl p-3 w-48 border border-white/10">
          <p className="text-xs text-gray-400 mb-2">Up next</p>
          <img src={nextVideo.thumbnail} alt={nextVideo.title} className="w-full aspect-video object-cover rounded-lg mb-2" />
          <p className="text-xs text-white line-clamp-2">{nextVideo.title}</p>
          <a href={`/watch?id=${nextVideo.id}`} className="mt-2 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
            Play now <ChevronRight size={12} />
          </a>
        </div>
      )}

      {/* Controls overlay */}
      <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Title */}
        {title && (
          <div className="absolute top-3 left-4 right-4">
            <p className="text-white text-sm font-medium line-clamp-1 drop-shadow">{title}</p>
          </div>
        )}

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!playing && !loading && (
            <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
              <Play size={28} fill="white" className="text-white ml-1" />
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="relative px-4 pb-3 pt-8">
          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="relative h-1 bg-white/30 rounded-full cursor-pointer mb-3 group/progress hover:h-2 transition-all"
          >
            {/* Buffered */}
            <div className="absolute left-0 top-0 h-full bg-white/30 rounded-full" style={{ width: `${bufferedPercent}%` }} />
            {/* Played */}
            <div className="absolute left-0 top-0 h-full bg-yt-red rounded-full" style={{ width: `${progressPercent}%` }} />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yt-red rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg"
              style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-gray-300 transition-colors p-1">
              {playing ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
            </button>

            {/* Skip back */}
            <button onClick={() => skip(-10)} className="text-white hover:text-gray-300 transition-colors p-1" title="Rewind 10s (J)">
              <SkipBack size={18} />
            </button>

            {/* Skip forward */}
            <button onClick={() => skip(10)} className="text-white hover:text-gray-300 transition-colors p-1" title="Forward 10s (L)">
              <SkipForward size={18} />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1 group/vol">
              <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors p-1">
                {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/vol:w-16 transition-all duration-200 accent-white h-1 cursor-pointer"
              />
            </div>

            {/* Time */}
            <span className="text-white text-xs font-mono ml-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Playback speed */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(s => !s)}
                className="text-white hover:text-gray-300 transition-colors p-1 text-xs font-bold"
              >
                {playbackRate}x
              </button>
              {showSettings && (
                <div className="absolute bottom-8 right-0 bg-black/90 border border-white/10 rounded-xl overflow-hidden w-28">
                  <p className="text-xs text-gray-400 px-3 py-2 border-b border-white/10">Speed</p>
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRate(rate)}
                      className={`flex items-center justify-between w-full px-3 py-1.5 text-xs hover:bg-white/10 transition-colors ${playbackRate === rate ? 'text-yt-red font-bold' : 'text-white'}`}
                    >
                      {rate === 1 ? 'Normal' : `${rate}x`}
                      {playbackRate === rate && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <button onClick={() => setShowSettings(s => !s)} className="text-white hover:text-gray-300 transition-colors p-1">
              <Settings size={18} />
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition-colors p-1">
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
