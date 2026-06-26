'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ListVideo, Plus, MoreVertical, Lock, Globe } from 'lucide-react';

const SAMPLE_PLAYLISTS = [
  { id: '1', name: 'Watch Later', count: 0, visibility: 'Private', thumbnail: '' },
  { id: '2', name: 'Liked Videos', count: 0, visibility: 'Private', thumbnail: '' },
  { id: '3', name: 'My Favorites', count: 0, visibility: 'Public', thumbnail: '' },
];

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState(SAMPLE_PLAYLISTS);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [visibility, setVisibility] = useState('Public');

  const handleCreate = () => {
    if (!newName.trim()) return;
    setPlaylists(prev => [...prev, {
      id: Date.now().toString(),
      name: newName,
      count: 0,
      visibility,
      thumbnail: '',
    }]);
    setNewName('');
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yt-surface flex items-center justify-center">
                <ListVideo size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Playlists</h1>
                <p className="text-sm text-yt-muted">{playlists.length} playlists</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yt-surface hover:bg-yt-border rounded-full text-sm font-medium transition-colors"
            >
              <Plus size={16} /> New playlist
            </button>
          </div>

          {showCreate && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <div className="bg-yt-surface2 rounded-2xl p-6 w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">New playlist</h2>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Playlist name"
                  className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors mb-4"
                />
                <div className="mb-4">
                  <label className="block text-xs font-medium text-yt-muted mb-2">Visibility</label>
                  <select
                    value={visibility}
                    onChange={e => setVisibility(e.target.value)}
                    className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 text-sm text-yt-text focus:outline-none"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 bg-yt-surface hover:bg-yt-border rounded-xl text-sm font-medium transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleCreate} disabled={!newName.trim()} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors">
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {playlists.map(playlist => (
              <div key={playlist.id} className="group cursor-pointer">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-surface mb-2">
                  {playlist.thumbnail ? (
                    <img src={playlist.thumbnail} alt={playlist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ListVideo size={32} className="text-yt-muted" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-black/80 px-2 py-1 text-xs font-bold">
                    {playlist.count} videos
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-white transition-colors">{playlist.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      {playlist.visibility === 'Private' ? <Lock size={12} className="text-yt-muted" /> : <Globe size={12} className="text-yt-muted" />}
                      <span className="text-xs text-yt-muted">{playlist.visibility}</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-yt-surface transition-all">
                    <MoreVertical size={16} className="text-yt-muted" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
