'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import {
  Upload, X, Video, Image, Link, CheckCircle2,
  Loader2, ChevronDown, Tag, FileVideo, Globe
} from 'lucide-react';

const CATEGORIES = [
  'Technology', 'Gaming', 'Music', 'Education', 'Cooking',
  'Travel', 'Comedy', 'Sports', 'News', 'Science', 'Fitness', 'General'
];

type UploadMode = 'file' | 'url';
type Step = 'upload' | 'details' | 'success';

export default function UploadPage() {
  const [step, setStep] = useState<Step>('upload');
  const [uploadMode, setUploadMode] = useState<UploadMode>('file');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  // Video
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [draggingVideo, setDraggingVideo] = useState(false);

  // Thumbnail
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [draggingThumb, setDraggingThumb] = useState(false);

  // Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [channel] = useState('Your Channel');

  // Uploaded video result
  const [uploadedVideo, setUploadedVideo] = useState<any>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setTitle(file.name.replace(/\.[^/.]+$/, ''));
    setError('');
  };

  const handleThumbnailFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingVideo(false);
    const file = e.dataTransfer.files[0];
    if (file) handleVideoFile(file);
  };

  const handleThumbDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingThumb(false);
    const file = e.dataTransfer.files[0];
    if (file) handleThumbnailFile(file);
  };

  const handleNext = () => {
    if (uploadMode === 'file' && !videoFile) {
      setError('Please select a video file');
      return;
    }
    if (uploadMode === 'url' && !videoUrl.trim()) {
      setError('Please enter a video URL');
      return;
    }
    setError('');
    setStep('details');
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setUploading(true);
    setError('');

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(progressInterval); return 90; }
        return p + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('channel', channel);
      formData.append('channelId', 'default');
      formData.append('tags', tags);

      if (uploadMode === 'file' && videoFile) {
        formData.append('videoFile', videoFile);
      } else {
        formData.append('videoUrl', videoUrl);
      }

      if (thumbnailFile) {
        formData.append('thumbnailFile', thumbnailFile);
      } else if (thumbnailUrl) {
        formData.append('thumbnailUrl', thumbnailUrl);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setUploadedVideo(data.video);
        setTimeout(() => {
          setStep('success');
          setUploading(false);
        }, 500);
      } else {
        setError(data.error || 'Upload failed');
        setUploading(false);
        setProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('Upload failed. Please try again.');
      setUploading(false);
      setProgress(0);
    }
  };

  const reset = () => {
    setStep('upload');
    setVideoFile(null);
    setVideoUrl('');
    setVideoPreview('');
    setThumbnailFile(null);
    setThumbnailUrl('');
    setThumbnailPreview('');
    setTitle('');
    setDescription('');
    setCategory('General');
    setTags('');
    setProgress(0);
    setError('');
    setUploadedVideo(null);
  };

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-yt-red/10 flex items-center justify-center">
              <Upload size={20} className="text-yt-red" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Upload Video</h1>
              <p className="text-sm text-yt-muted">Share your video with the world</p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            {[
              { label: 'Select Video', step: 'upload' },
              { label: 'Add Details', step: 'details' },
              { label: 'Published', step: 'success' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  step === s.step ? 'bg-yt-red text-white' :
                  (i === 1 && step === 'success') || (i === 0 && step !== 'upload') ? 'bg-green-500 text-white' :
                  'bg-yt-surface text-yt-muted'
                }`}>
                  {(i === 0 && step !== 'upload') || (i === 1 && step === 'success')
                    ? <CheckCircle2 size={14} />
                    : i + 1
                  }
                </div>
                <span className={`text-xs font-medium ${step === s.step ? 'text-white' : 'text-yt-muted'}`}>
                  {s.label}
                </span>
                {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${
                  (i === 0 && step !== 'upload') || (i === 1 && step === 'success') ? 'bg-green-500' : 'bg-yt-border'
                }`} />}
              </div>
            ))}
          </div>

          {/* STEP 1: Select Video */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Upload mode toggle */}
              <div className="flex gap-2 p-1 bg-yt-surface rounded-xl w-fit">
                <button
                  onClick={() => setUploadMode('file')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    uploadMode === 'file' ? 'bg-yt-bg text-white' : 'text-yt-muted hover:text-white'
                  }`}
                >
                  <FileVideo size={16} />
                  Upload File
                </button>
                <button
                  onClick={() => setUploadMode('url')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    uploadMode === 'url' ? 'bg-yt-bg text-white' : 'text-yt-muted hover:text-white'
                  }`}
                >
                  <Globe size={16} />
                  Video URL
                </button>
              </div>

              {/* File upload */}
              {uploadMode === 'file' && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDraggingVideo(true); }}
                  onDragLeave={() => setDraggingVideo(false)}
                  onDrop={handleVideoDrop}
                  onClick={() => videoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    draggingVideo ? 'border-blue-400 bg-blue-400/10' :
                    videoFile ? 'border-green-500 bg-green-500/10' :
                    'border-yt-border hover:border-yt-muted'
                  }`}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleVideoFile(e.target.files[0])}
                  />
                  {videoFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 size={48} className="text-green-500" />
                      <p className="font-medium text-green-400">{videoFile.name}</p>
                      <p className="text-sm text-yt-muted">
                        {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setVideoFile(null); setVideoPreview(''); }}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-yt-surface flex items-center justify-center">
                        <FileVideo size={28} className="text-yt-muted" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Drag and drop your video here</p>
                        <p className="text-sm text-yt-muted">or click to browse</p>
                      </div>
                      <p className="text-xs text-yt-muted">
                        MP4, MOV, AVI, MKV supported • Max 2GB
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* URL input */}
              {uploadMode === 'url' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-yt-muted">
                    Video URL
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-3 bg-yt-surface border border-yt-border rounded-xl px-4 py-3 focus-within:border-blue-400 transition-colors">
                      <Link size={18} className="text-yt-muted flex-shrink-0" />
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        className="flex-1 bg-transparent text-sm placeholder-yt-muted focus:outline-none"
                      />
                      {videoUrl && (
                        <button onClick={() => setVideoUrl('')}>
                          <X size={16} className="text-yt-muted hover:text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                  {videoUrl && (
                    <div className="rounded-xl overflow-hidden bg-black aspect-video">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Video preview for file */}
              {uploadMode === 'file' && videoPreview && (
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  <video src={videoPreview} controls className="w-full h-full" />
                </div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                onClick={handleNext}
                disabled={uploadMode === 'file' ? !videoFile : !videoUrl.trim()}
                className="w-full py-3 bg-yt-red hover:bg-yt-red-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
              >
                Continue to Details
              </button>
            </div>
          )}

          {/* STEP 2: Details */}
          {step === 'details' && (
            <div className="space-y-5">
              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail</label>
                <div className="flex gap-3">
                  {/* File upload */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDraggingThumb(true); }}
                    onDragLeave={() => setDraggingThumb(false)}
                    onDrop={handleThumbDrop}
                    onClick={() => thumbInputRef.current?.click()}
                    className={`relative flex-1 aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
                      draggingThumb ? 'border-blue-400' :
                      thumbnailPreview ? 'border-green-500' :
                      'border-yt-border hover:border-yt-muted'
                    }`}
                  >
                    <input
                      ref={thumbInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleThumbnailFile(e.target.files[0])}
                    />
                    {thumbnailPreview ? (
                      <>
                        <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => { e.stopPropagation(); setThumbnailFile(null); setThumbnailPreview(''); }}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
                        <Image size={24} className="text-yt-muted" />
                        <p className="text-xs text-yt-muted text-center">Upload thumbnail</p>
                      </div>
                    )}
                  </div>

                  {/* URL input */}
                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-xs text-yt-muted">Or use image URL</p>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => {
                        setThumbnailUrl(e.target.value);
                        if (!thumbnailFile) setThumbnailPreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-yt-surface border border-yt-border rounded-xl px-3 py-2 text-xs placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
                    />
                    {thumbnailUrl && !thumbnailFile && (
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-full aspect-video rounded-lg object-cover"
                        onError={() => setThumbnailPreview('')}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title..."
                  maxLength={100}
                  className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors"
                />
                <p className="text-xs text-yt-muted mt-1 text-right">{title.length}/100</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers about your video..."
                  maxLength={1000}
                  rows={4}
                  className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 text-sm placeholder-yt-muted focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
                <p className="text-xs text-yt-muted mt-1 text-right">{description.length}/1000</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-yt-surface border border-yt-border rounded-xl px-4 py-3 text-sm text-yt-text focus:outline-none focus:border-blue-400 transition-colors appearance-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-yt-muted pointer-events-none" />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Tags
                </label>
                <div className="flex items-center gap-2 bg-yt-surface border border-yt-border rounded-xl px-4 py-3 focus-within:border-blue-400 transition-colors">
                  <Tag size={16} className="text-yt-muted flex-shrink-0" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="nextjs, react, typescript (comma separated)"
                    className="flex-1 bg-transparent text-sm placeholder-yt-muted focus:outline-none"
                  />
                </div>
                <p className="text-xs text-yt-muted mt-1">Separate tags with commas</p>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              {/* Upload progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yt-muted">Uploading...</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 bg-yt-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yt-red rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('upload')}
                  disabled={uploading}
                  className="px-6 py-3 bg-yt-surface hover:bg-yt-border disabled:opacity-40 rounded-xl text-sm font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-yt-red hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                >
                  {uploading ? (
                    <><Loader2 size={18} className="animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload size={18} /> Upload Video</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 'success' && uploadedVideo && (
            <div className="flex flex-col items-center text-center gap-6 py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 size={44} className="text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Video Uploaded! 🎉</h2>
                <p className="text-yt-muted text-sm">Your video has been saved to the database</p>
              </div>

              {/* Video preview card */}
              <div className="w-full bg-yt-surface rounded-2xl overflow-hidden text-left">
                {uploadedVideo.thumbnail && (
                  <img
                    src={uploadedVideo.thumbnail}
                    alt={uploadedVideo.title}
                    className="w-full aspect-video object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{uploadedVideo.title}</h3>
                  <p className="text-sm text-yt-muted">{uploadedVideo.channel}</p>
                  <p className="text-xs text-yt-muted mt-1">{uploadedVideo.category}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <a
                  href="/"
                  className="flex-1 py-3 bg-yt-surface hover:bg-yt-border rounded-xl text-sm font-medium transition-colors text-center"
                >
                  Go to Home
                </a>
                <button
                  onClick={reset}
                  className="flex-1 py-3 bg-yt-red hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Upload Another
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
