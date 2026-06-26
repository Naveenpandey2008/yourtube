'use client';

import { useState } from 'react';
import { X, Camera, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

interface CreateChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = ['Basic Info', 'Customize', 'Done'];

export default function CreateChannelDialog({ isOpen, onClose }: CreateChannelDialogProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [handleTouched, setHandleTouched] = useState(false);

  // Step 2 fields
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleNameChange = (val: string) => {
    setName(val);
    if (!handleTouched) {
      setHandle('@' + val.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, ''));
    }
  };

  const handleHandleChange = (val: string) => {
    setHandleTouched(true);
    if (!val.startsWith('@')) {
      setHandle('@' + val.replace(/[^a-z0-9]/g, ''));
    } else {
      setHandle('@' + val.slice(1).replace(/[^a-z0-9]/g, ''));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      setLoading(true);
      try {
        const res = await fetch('/api/channel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'guest',
            name,
            handle,
            description,
            avatar: avatarPreview || '',
            category,
            type: 'Personal',
          }),
        });
        const data = await res.json();
        if (data.success) {
          setStep(2);
        } else {
          alert(data.error || 'Failed to create channel');
        }
      } catch (err) {
        alert('Failed to create channel');
      } finally {
        setLoading(false);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const handleClose = () => {
    setStep(0);
    setName('');
    setHandle('');
    setHandleTouched(false);
    setDescription('');
    setCategory('');
    setAvatarPreview('');
    onClose();
  };

  const isStep1Valid = name.trim().length >= 2 && handle.length >= 2;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-yt-surface2 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yt-border">
          <h2 className="text-lg font-semibold">Create your channel</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-yt-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center px-6 py-3 gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${
                i < step
                  ? 'bg-green-500 text-white'
                  : i === step
                  ? 'bg-blue-500 text-white'
                  : 'bg-yt-border text-yt-muted'
              }`}>
                {i < step ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? 'text-white' : 'text-yt-muted'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${i < step ? 'bg-green-500' : 'bg-yt-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-4">

          {/* STEP 1: Basic Info */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-yt-muted">
                Choose a name and handle for your channel. You can always change these later.
              </p>

              {/* Avatar picker */}
              <div className="flex justify-center py-2">
                <label className="relative cursor-pointer group">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden ring-2 ring-yt-border group-hover:ring-blue-400 transition-all">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {name ? name[0].toUpperCase() : 'Y'}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-yt-surface border-2 border-yt-surface2 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Camera size={13} />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-yt-muted mb-1.5">
                  Channel name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. My Awesome Channel"
                  maxLength={50}
                  className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-2.5 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-yt-muted">Min 2 characters</p>
                  <p className="text-xs text-yt-muted">{name.length}/50</p>
                </div>
              </div>

              {/* Handle */}
              <div>
                <label className="block text-xs font-medium text-yt-muted mb-1.5">
                  Handle <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={e => handleHandleChange(e.target.value)}
                  placeholder="@yourchannel"
                  maxLength={30}
                  className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-2.5 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
                />
                <p className="text-xs text-yt-muted mt-1">
                  Your unique URL: yourtube.com/{handle || '@yourchannel'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Customize */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-yt-muted">
                Tell viewers what your channel is about.
              </p>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-yt-muted mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tell viewers about your channel..."
                  maxLength={500}
                  rows={4}
                  className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-2.5 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
                <p className="text-xs text-yt-muted mt-1 text-right">{description.length}/500</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-yt-muted mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-2.5 text-sm text-yt-text focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Select a category</option>
                  {['Gaming', 'Music', 'Education', 'Technology', 'Cooking', 'Travel',
                    'Comedy', 'Sports', 'News', 'Science', 'Fashion', 'Fitness'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Channel type */}
              <div>
                <label className="block text-xs font-medium text-yt-muted mb-2">
                  Channel type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Personal', icon: '👤', desc: 'Just for you' },
                    { label: 'Brand', icon: '🏢', desc: 'For a business' },
                  ].map(type => (
                    <button
                      key={type.label}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl border border-yt-border hover:border-blue-400 hover:bg-yt-surface transition-all text-center"
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                      <span className="text-xs text-yt-muted">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Done */}
          {step === 2 && (
            <div className="flex flex-col items-center py-6 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Channel created! 🎉</h3>
                <p className="text-sm text-yt-muted">
                  Your channel <span className="text-white font-medium">{name}</span> is ready.
                  Start uploading videos and sharing with the world!
                </p>
              </div>
              {/* Preview card */}
              <div className="w-full bg-yt-surface rounded-xl p-4 flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold overflow-hidden flex-shrink-0">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span>{name[0]?.toUpperCase()}</span>
                  }
                </div>
                <div>
                  <p className="font-medium text-sm">{name}</p>
                  <p className="text-xs text-yt-muted">{handle} · 0 subscribers</p>
                  {category && <p className="text-xs text-yt-muted">{category}</p>}
                </div>
              </div>
              <a
                href="/channel"
                onClick={handleClose}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors text-center"
              >
                Go to my channel
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 2 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-yt-border">
            <button
              onClick={() => step === 0 ? handleClose() : setStep(s => s - 1)}
              className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-yt-surface transition-colors"
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleNext}
              disabled={(step === 0 && !isStep1Valid) || loading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating...</>
              ) : step === 1 ? (
                <>Create Channel <CheckCircle2 size={16} /></>
              ) : (
                <>Next <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
