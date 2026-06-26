'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  User, Bell, Shield, Eye, Globe, Smartphone,
  Moon, Play, MessageSquare, Key, Trash2, ChevronRight,
  CheckCircle2, ToggleLeft, ToggleRight
} from 'lucide-react';

const SECTIONS = [
  { icon: User, label: 'Account', id: 'account' },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
  { icon: Eye, label: 'Privacy', id: 'privacy' },
  { icon: Play, label: 'Playback', id: 'playback' },
  { icon: Moon, label: 'Appearance', id: 'appearance' },
  { icon: Globe, label: 'Language & Region', id: 'language' },
  { icon: MessageSquare, label: 'Connected Apps', id: 'connected' },
  { icon: Shield, label: 'Security', id: 'security' },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex-shrink-0">
      {enabled
        ? <ToggleRight size={32} className="text-blue-500" />
        : <ToggleLeft size={32} className="text-yt-muted" />
      }
    </button>
  );
}

function SettingRow({
  label, description, toggle, value, onChange, danger
}: {
  label: string;
  description?: string;
  toggle?: boolean;
  value?: boolean;
  onChange?: () => void;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-yt-border last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <p className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-yt-text'}`}>{label}</p>
        {description && <p className="text-xs text-yt-muted mt-0.5 leading-relaxed">{description}</p>}
      </div>
      {toggle && onChange && (
        <Toggle enabled={value || false} onChange={onChange} />
      )}
      {!toggle && (
        <ChevronRight size={18} className="text-yt-muted flex-shrink-0" />
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');

  // Account
  const [name, setName] = useState('Your Channel');
  const [handle, setHandle] = useState('@yourchannel');
  const [email, setEmail] = useState('you@example.com');
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);

  // Notifications
  const [notifSubscriptions, setNotifSubscriptions] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifReplies, setNotifReplies] = useState(true);
  const [notifLikes, setNotifLikes] = useState(false);
  const [notifMentions, setNotifMentions] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);

  // Privacy
  const [historyPaused, setHistoryPaused] = useState(false);
  const [searchHistoryPaused, setSearchHistoryPaused] = useState(false);
  const [privateSubscriptions, setPrivateSubscriptions] = useState(false);
  const [privateLikedVideos, setPrivateLikedVideos] = useState(true);
  const [safeSearch, setSafeSearch] = useState(false);

  // Playback
  const [autoplay, setAutoplay] = useState(true);
  const [annotations, setAnnotations] = useState(false);
  const [defaultQuality, setDefaultQuality] = useState('Auto');
  const [defaultSpeed, setDefaultSpeed] = useState('1x');
  const [subtitles, setSubtitles] = useState(false);
  const [miniPlayer, setMiniPlayer] = useState(true);

  // Appearance
  const [darkMode, setDarkMode] = useState(true);
  const [denseMode, setDenseMode] = useState(false);

  // Language
  const [language, setLanguage] = useState('English (US)');
  const [region, setRegion] = useState('India');

  const activeLabel = SECTIONS.find(s => s.id === activeSection)?.label;

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <div className="flex flex-col sm:flex-row gap-6">

            {/* Sidebar */}
            <aside className="sm:w-56 flex-shrink-0">
              <nav className="space-y-0.5">
                {SECTIONS.map(({ icon: Icon, label, id }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                      activeSection === id
                        ? 'bg-yt-surface text-white'
                        : 'text-yt-muted hover:bg-yt-surface hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-yt-surface2 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">{activeLabel}</h2>

                {/* ACCOUNT */}
                {activeSection === 'account' && (
                  <div className="space-y-0">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 pb-6 border-b border-yt-border mb-2">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        Y
                      </div>
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-yt-muted">{handle}</p>
                        <button className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                          Change photo
                        </button>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="py-4 border-b border-yt-border">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Channel name</p>
                        <button
                          onClick={() => setEditingName(e => !e)}
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {editingName ? 'Cancel' : 'Edit'}
                        </button>
                      </div>
                      {editingName ? (
                        <div className="flex gap-2 mt-2">
                          <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="flex-1 bg-yt-surface border border-yt-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                          />
                          <button
                            onClick={() => setEditingName(false)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-medium rounded-lg transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-yt-muted">{name}</p>
                      )}
                    </div>

                    {/* Handle */}
                    <div className="py-4 border-b border-yt-border">
                      <p className="text-sm font-medium mb-1">Handle</p>
                      <p className="text-sm text-yt-muted">{handle}</p>
                    </div>

                    {/* Email */}
                    <div className="py-4 border-b border-yt-border">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Email</p>
                        <button
                          onClick={() => setEditingEmail(e => !e)}
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {editingEmail ? 'Cancel' : 'Edit'}
                        </button>
                      </div>
                      {editingEmail ? (
                        <div className="flex gap-2 mt-2">
                          <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="flex-1 bg-yt-surface border border-yt-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                          />
                          <button
                            onClick={() => setEditingEmail(false)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-medium rounded-lg transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-yt-muted">{email}</p>
                      )}
                    </div>

                    {/* Danger zone */}
                    <div className="pt-6 space-y-2">
                      <p className="text-xs font-semibold text-yt-muted uppercase tracking-wide mb-3">Danger Zone</p>
                      <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={16} /> Delete channel
                      </button>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS */}
                {activeSection === 'notifications' && (
                  <div>
                    <p className="text-xs text-yt-muted mb-4">Choose what notifications you receive.</p>
                    <SettingRow label="Subscriptions" description="Notify me about new uploads from channels I subscribe to" toggle value={notifSubscriptions} onChange={() => setNotifSubscriptions(v => !v)} />
                    <SettingRow label="Comments" description="Notify me when someone comments on my videos" toggle value={notifComments} onChange={() => setNotifComments(v => !v)} />
                    <SettingRow label="Replies" description="Notify me when someone replies to my comments" toggle value={notifReplies} onChange={() => setNotifReplies(v => !v)} />
                    <SettingRow label="Likes" description="Notify me when someone likes my videos or comments" toggle value={notifLikes} onChange={() => setNotifLikes(v => !v)} />
                    <SettingRow label="Mentions" description="Notify me when someone mentions my channel" toggle value={notifMentions} onChange={() => setNotifMentions(v => !v)} />
                    <SettingRow label="Email notifications" description="Also receive notifications via email" toggle value={notifEmail} onChange={() => setNotifEmail(v => !v)} />
                  </div>
                )}

                {/* PRIVACY */}
                {activeSection === 'privacy' && (
                  <div>
                    <p className="text-xs text-yt-muted mb-4">Control your data and privacy settings.</p>
                    <SettingRow label="Pause watch history" description="Videos you watch won't appear in history or affect recommendations" toggle value={historyPaused} onChange={() => setHistoryPaused(v => !v)} />
                    <SettingRow label="Pause search history" description="Searches won't be saved to your history" toggle value={searchHistoryPaused} onChange={() => setSearchHistoryPaused(v => !v)} />
                    <SettingRow label="Private subscriptions" description="Hide the list of channels you subscribe to" toggle value={privateSubscriptions} onChange={() => setPrivateSubscriptions(v => !v)} />
                    <SettingRow label="Private liked videos" description="Hide videos you've liked from your public profile" toggle value={privateLikedVideos} onChange={() => setPrivateLikedVideos(v => !v)} />
                    <SettingRow label="Restricted mode" description="Filter out potentially mature content" toggle value={safeSearch} onChange={() => setSafeSearch(v => !v)} />
                    <SettingRow label="Download your data" description="Get a copy of all your YourTube data" />
                    <SettingRow label="Clear watch history" danger />
                    <SettingRow label="Clear search history" danger />
                  </div>
                )}

                {/* PLAYBACK */}
                {activeSection === 'playback' && (
                  <div>
                    <SettingRow label="Autoplay" description="Automatically play the next video" toggle value={autoplay} onChange={() => setAutoplay(v => !v)} />
                    <SettingRow label="Subtitles / CC" description="Show subtitles when available" toggle value={subtitles} onChange={() => setSubtitles(v => !v)} />
                    <SettingRow label="Annotations" description="Show interactive cards on videos" toggle value={annotations} onChange={() => setAnnotations(v => !v)} />
                    <SettingRow label="Mini player" description="Keep video playing in a small window when navigating" toggle value={miniPlayer} onChange={() => setMiniPlayer(v => !v)} />

                    {/* Default quality */}
                    <div className="py-4 border-b border-yt-border">
                      <p className="text-sm font-medium mb-2">Default video quality</p>
                      <div className="flex flex-wrap gap-2">
                        {['Auto', '1080p', '720p', '480p', '360p'].map(q => (
                          <button
                            key={q}
                            onClick={() => setDefaultQuality(q)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              defaultQuality === q ? 'bg-white text-black' : 'bg-yt-surface hover:bg-yt-border text-yt-text'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Default speed */}
                    <div className="py-4">
                      <p className="text-sm font-medium mb-2">Default playback speed</p>
                      <div className="flex flex-wrap gap-2">
                        {['0.25x', '0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'].map(s => (
                          <button
                            key={s}
                            onClick={() => setDefaultSpeed(s)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              defaultSpeed === s ? 'bg-white text-black' : 'bg-yt-surface hover:bg-yt-border text-yt-text'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* APPEARANCE */}
                {activeSection === 'appearance' && (
                  <div>
                    <SettingRow label="Dark mode" description="Use dark theme across YourTube" toggle value={darkMode} onChange={() => setDarkMode(v => !v)} />
                    <SettingRow label="Dense display mode" description="Show more content by reducing spacing" toggle value={denseMode} onChange={() => setDenseMode(v => !v)} />

                    {/* Theme color */}
                    <div className="py-4">
                      <p className="text-sm font-medium mb-3">Accent color</p>
                      <div className="flex gap-3">
                        {['#FF0000', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'].map(color => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-yt-surface2 transition-all hover:scale-110"
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* LANGUAGE */}
                {activeSection === 'language' && (
                  <div>
                    <div className="py-4 border-b border-yt-border">
                      <p className="text-sm font-medium mb-2">Language</p>
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="bg-yt-surface border border-yt-border rounded-lg px-3 py-2 text-sm text-yt-text focus:outline-none focus:border-blue-400 w-full max-w-xs"
                      >
                        {['English (US)', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Portuguese'].map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div className="py-4">
                      <p className="text-sm font-medium mb-2">Region</p>
                      <select
                        value={region}
                        onChange={e => setRegion(e.target.value)}
                        className="bg-yt-surface border border-yt-border rounded-lg px-3 py-2 text-sm text-yt-text focus:outline-none focus:border-blue-400 w-full max-w-xs"
                      >
                        {['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* CONNECTED APPS */}
                {activeSection === 'connected' && (
                  <div>
                    <p className="text-xs text-yt-muted mb-4">Apps and services connected to your account.</p>
                    {[
                      { name: 'Google', icon: '🔵', connected: true, desc: 'Sign in with Google' },
                      { name: 'Twitter / X', icon: '🐦', connected: false, desc: 'Share videos to Twitter' },
                      { name: 'Discord', icon: '🎮', connected: true, desc: 'Show activity on Discord' },
                      { name: 'Spotify', icon: '🎵', connected: false, desc: 'Link your music account' },
                    ].map(app => (
                      <div key={app.name} className="flex items-center justify-between py-4 border-b border-yt-border last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{app.icon}</span>
                          <div>
                            <p className="text-sm font-medium">{app.name}</p>
                            <p className="text-xs text-yt-muted">{app.desc}</p>
                          </div>
                        </div>
                        <button className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          app.connected
                            ? 'bg-yt-surface hover:bg-yt-border text-yt-muted'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}>
                          {app.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* SECURITY */}
                {activeSection === 'security' && (
                  <div>
                    <SettingRow label="Change password" description="Update your account password" />
                    <SettingRow label="Two-factor authentication" description="Add an extra layer of security to your account" />
                    <SettingRow label="Active sessions" description="View and manage devices signed into your account" />
                    <SettingRow label="Login history" description="See recent sign-in activity" />
                    <div className="pt-6">
                      <p className="text-xs font-semibold text-yt-muted uppercase tracking-wide mb-3">Danger Zone</p>
                      <SettingRow label="Delete account" description="Permanently delete your YourTube account and all data" danger />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}