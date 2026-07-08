'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import {
  Users, MessageSquare, Mic, MicOff, Video, VideoOff,
  Phone, Copy, Check, Send, Crown, Share2, X,
  Play, Pause, Volume2, VolumeX
} from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

interface Participant {
  id: string;
  name: string;
  muted: boolean;
  videoOff: boolean;
  isHost: boolean;
}

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function WatchPartyPage() {
  const [step, setStep] = useState<'setup' | 'party'>('setup');
  const [isHost, setIsHost] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [userName, setUserName] = useState('You');
  const [videoUrl, setVideoUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Party state
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messageText, setMessageText] = useState('');
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add system message
  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      user: 'System',
      text,
      time: formatTime(new Date()),
      isSystem: true,
    }]);
  };

  // Create room
  const handleCreateRoom = async () => {
    if (!userName.trim()) return;
    const id = generateRoomId();
    setRoomId(id);
    setIsHost(true);

    // Add host as first participant
    setParticipants([{
      id: 'host',
      name: userName,
      muted: false,
      videoOff: false,
      isHost: true,
    }]);

    addSystemMessage(`Room ${id} created! Share the code with friends.`);
    addSystemMessage(`${userName} joined as host`);

    // Start camera
    await startCamera();
    setStep('party');
  };

  // Join room
  const handleJoinRoom = async () => {
    if (!joinRoomId.trim() || !userName.trim()) return;
    setRoomId(joinRoomId.toUpperCase());
    setIsHost(false);

    setParticipants([
      { id: 'host', name: 'Host', muted: false, videoOff: false, isHost: true },
      { id: 'me', name: userName, muted: false, videoOff: false, isHost: false },
    ]);

    addSystemMessage(`Joined room ${joinRoomId.toUpperCase()}`);
    addSystemMessage(`${userName} joined the party`);

    await startCamera();
    setStep('party');
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log('Camera not available:', err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  // Leave party
  const handleLeave = () => {
    stopCamera();
    setStep('setup');
    setMessages([]);
    setParticipants([]);
    setRoomId('');
    setPlaying(false);
  };

  // Toggle mute
  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = muted;
      });
    }
    setMuted(m => !m);
    setParticipants(prev => prev.map(p =>
      p.id === 'host' || p.id === 'me' ? { ...p, muted: !muted } : p
    ));
  };

  // Toggle video
  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = videoOff;
      });
    }
    setVideoOff(v => !v);
  };

  // Send message
  const sendMessage = () => {
    if (!messageText.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      user: userName,
      text: messageText.trim(),
      time: formatTime(new Date()),
    }]);
    setMessageText('');
  };

  // Copy room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sync play/pause
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      addSystemMessage(`${userName} paused the video`);
    } else {
      video.play();
      addSystemMessage(`${userName} played the video`);
    }
    setPlaying(p => !p);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-yt-bg">
        <Navbar onMenuClick={() => {}} />
        <main className="pt-14">
          <div className="max-w-2xl mx-auto px-4 py-12">

            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-yt-red/10 flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-yt-red" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Watch Party</h1>
              <p className="text-yt-muted">Watch videos together with friends in real time</p>
            </div>

            {/* Name input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-yt-muted mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Create room */}
              <div className="bg-yt-surface2 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Crown size={20} className="text-yellow-400" />
                  <h2 className="text-base font-semibold">Create a Room</h2>
                </div>
                <p className="text-sm text-yt-muted mb-4">
                  Start a new watch party and invite your friends.
                </p>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-yt-muted mb-1.5">Video URL (optional)</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full bg-yt-surface border border-yt-border rounded-xl px-3 py-2 text-xs placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <button
                  onClick={handleCreateRoom}
                  disabled={!userName.trim()}
                  className="w-full py-2.5 bg-yt-red hover:bg-red-700 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Create Room
                </button>
              </div>

              {/* Join room */}
              <div className="bg-yt-surface2 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={20} className="text-blue-400" />
                  <h2 className="text-base font-semibold">Join a Room</h2>
                </div>
                <p className="text-sm text-yt-muted mb-4">
                  Enter a room code to join your friend's watch party.
                </p>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-yt-muted mb-1.5">Room Code</label>
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={e => setJoinRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter room code..."
                    maxLength={6}
                    className="w-full bg-yt-surface border border-yt-border rounded-xl px-3 py-2 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors font-mono tracking-widest"
                  />
                </div>
                <button
                  onClick={handleJoinRoom}
                  disabled={!joinRoomId.trim() || !userName.trim()}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Join Room
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: <Video size={18} />, label: 'Video Call' },
                { icon: <MessageSquare size={18} />, label: 'Live Chat' },
                { icon: <Play size={18} />, label: 'Sync Playback' },
              ].map(f => (
                <div key={f.label} className="flex flex-col items-center gap-2 p-3 bg-yt-surface rounded-xl">
                  <div className="text-yt-muted">{f.icon}</div>
                  <span className="text-xs text-yt-muted">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yt-bg flex flex-col">
      {/* Top bar */}
      <div className="h-14 bg-yt-surface2 border-b border-yt-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yt-red flex items-center justify-center">
            <Users size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">Watch Party</p>
            <p className="text-xs text-yt-muted">{participants.length} participant{participants.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Room ID */}
          <button
            onClick={copyRoomId}
            className="flex items-center gap-2 px-3 py-1.5 bg-yt-surface hover:bg-yt-border rounded-lg text-sm transition-colors"
          >
            <span className="font-mono font-bold text-yt-red">{roomId}</span>
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-yt-muted" />}
          </button>

          {/* Toggle chat */}
          <button
            onClick={() => { setShowChat(c => !c); setShowParticipants(false); }}
            className={`p-2 rounded-lg transition-colors ${showChat ? 'bg-blue-600 text-white' : 'hover:bg-yt-surface text-yt-muted'}`}
          >
            <MessageSquare size={18} />
          </button>

          {/* Toggle participants */}
          <button
            onClick={() => { setShowParticipants(p => !p); setShowChat(false); }}
            className={`p-2 rounded-lg transition-colors ${showParticipants ? 'bg-blue-600 text-white' : 'hover:bg-yt-surface text-yt-muted'}`}
          >
            <Users size={18} />
          </button>

          {/* Leave */}
          <button
            onClick={handleLeave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Phone size={14} />
            Leave
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Video area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Main video player */}
          <div className="flex-1 bg-black relative">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Play size={48} className="text-yt-muted mx-auto mb-3" />
                  <p className="text-yt-muted text-sm">No video selected</p>
                  <p className="text-xs text-yt-muted mt-1">Host can add a video URL</p>
                </div>
              </div>
            )}

            {/* Video controls overlay */}
            {videoUrl && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <button onClick={handlePlayPause} className="text-white hover:text-gray-300 transition-colors">
                    {playing ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
                  </button>
                  <div className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer">
                    <div className="h-full w-1/3 bg-yt-red rounded-full" />
                  </div>
                  {isHost && (
                    <span className="text-xs text-white bg-yt-red px-2 py-0.5 rounded font-medium">HOST</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Participant videos */}
          <div className="h-24 bg-yt-surface2 border-t border-yt-border flex items-center gap-2 px-3 overflow-x-auto scrollbar-hide">
            {/* Local video */}
            <div className="relative flex-shrink-0 w-32 h-18 bg-yt-surface rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${videoOff ? 'hidden' : ''}`}
              />
              {videoOff && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">
                    {userName[0]?.toUpperCase()}
                  </div>
                </div>
              )}
              <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                <span className="text-xs text-white bg-black/60 px-1 rounded">{userName}</span>
                {muted && <MicOff size={10} className="text-red-400" />}
              </div>
            </div>

            {/* Other participants */}
            {participants.filter(p => p.id !== 'host' && p.id !== 'me').map(participant => (
              <div key={participant.id} className="relative flex-shrink-0 w-32 h-18 bg-yt-surface rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
                    {participant.name[0]?.toUpperCase()}
                  </div>
                </div>
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                  <span className="text-xs text-white bg-black/60 px-1 rounded">{participant.name}</span>
                  {participant.muted && <MicOff size={10} className="text-red-400" />}
                  {participant.isHost && <Crown size={10} className="text-yellow-400" />}
                </div>
              </div>
            ))}
          </div>

          {/* Call controls */}
          <div className="h-16 bg-yt-bg border-t border-yt-border flex items-center justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                muted ? 'bg-red-600 text-white' : 'bg-yt-surface hover:bg-yt-border text-yt-text'
              }`}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                videoOff ? 'bg-red-600 text-white' : 'bg-yt-surface hover:bg-yt-border text-yt-text'
              }`}
              title={videoOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {videoOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>

            <button
              onClick={copyRoomId}
              className="w-10 h-10 rounded-full bg-yt-surface hover:bg-yt-border flex items-center justify-center transition-colors"
              title="Copy room code"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}
            </button>

            <button
              onClick={handleLeave}
              className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors text-white"
              title="Leave call"
            >
              <Phone size={18} />
            </button>
          </div>
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <div className="w-72 flex-shrink-0 bg-yt-surface2 border-l border-yt-border flex flex-col">
            <div className="px-4 py-3 border-b border-yt-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">Live Chat</h3>
              <button onClick={() => setShowChat(false)} className="p-1 rounded-full hover:bg-yt-surface transition-colors">
                <X size={14} className="text-yt-muted" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
              {messages.map(msg => (
                <div key={msg.id}>
                  {msg.isSystem ? (
                    <p className="text-xs text-yt-muted text-center py-1">{msg.text}</p>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-blue-400">{msg.user}</span>
                        <span className="text-xs text-yt-muted">{msg.time}</span>
                      </div>
                      <p className="text-sm bg-yt-surface rounded-lg px-3 py-2">{msg.text}</p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-yt-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Send a message..."
                  className="flex-1 bg-yt-surface border border-yt-border rounded-xl px-3 py-2 text-xs placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl transition-colors"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants sidebar */}
        {showParticipants && (
          <div className="w-64 flex-shrink-0 bg-yt-surface2 border-l border-yt-border flex flex-col">
            <div className="px-4 py-3 border-b border-yt-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">Participants ({participants.length})</h3>
              <button onClick={() => setShowParticipants(false)} className="p-1 rounded-full hover:bg-yt-surface transition-colors">
                <X size={14} className="text-yt-muted" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {/* Current user */}
              <div className="flex items-center gap-3 p-2 bg-yt-surface rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {userName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userName} (You)</p>
                  {isHost && <p className="text-xs text-yellow-400">Host</p>}
                </div>
                <div className="flex gap-1">
                  {muted && <MicOff size={14} className="text-red-400" />}
                  {videoOff && <VideoOff size={14} className="text-red-400" />}
                </div>
              </div>

              {/* Other participants */}
              {participants.filter(p => p.name !== userName).map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 bg-yt-surface rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {p.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    {p.isHost && <p className="text-xs text-yellow-400">Host</p>}
                  </div>
                  <div className="flex gap-1">
                    {p.muted && <MicOff size={14} className="text-red-400" />}
                    {p.videoOff && <VideoOff size={14} className="text-red-400" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Invite */}
            <div className="p-3 border-t border-yt-border">
              <button
                onClick={copyRoomId}
                className="w-full flex items-center justify-center gap-2 py-2 bg-yt-surface hover:bg-yt-border rounded-xl text-sm transition-colors"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? 'Copied!' : `Copy Code: ${roomId}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}