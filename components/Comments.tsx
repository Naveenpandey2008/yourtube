'use client';

import { useState, useEffect } from 'react';
import {
  ThumbsUp, ThumbsDown, MoreVertical, Flag, Trash2,
  ChevronDown, ChevronUp, Loader2, Languages, X,
  MapPin, AlertTriangle, ShieldAlert
} from 'lucide-react';

interface Reply {
  _id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  createdAt: string;
  location?: string;
  showLocation?: boolean;
  reported?: boolean;
}

interface Comment {
  _id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  createdAt: string;
  pinned?: boolean;
  edited?: boolean;
  reported?: boolean;
  reportCount?: number;
  location?: string;
  showLocation?: boolean;
  replies: Reply[];
}

const SORT_OPTIONS = ['Top comments', 'Newest first'];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italian' },
];

const REPORT_REASONS = [
  'Spam or misleading',
  'Hateful or abusive',
  'Harassment or bullying',
  'Inappropriate content',
  'Other',
];

async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });
    const data = await res.json();
    if (data.success && data.translated) return data.translated;
    return '[Translation unavailable]';
  } catch {
    return '[Translation failed]';
  }
}

async function moderateComment(text: string): Promise<{ allowed: boolean; reason: string }> {
  try {
    const res = await fetch('/api/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return await res.json();
  } catch {
    return { allowed: true, reason: '' };
  }
}

function formatLikes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

// ── Translator ────────────────────────────────────────────
function Translator({ text }: { text: string }) {
  const [showMenu, setShowMenu] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState('');
  const [selectedLangName, setSelectedLangName] = useState('');

  const handleTranslate = async (langCode: string, langName: string) => {
    setSelectedLangName(langName);
    setShowMenu(false);
    setTranslating(true);
    const result = await translateText(text, langCode);
    setTranslated(result);
    setTranslating(false);
  };

  return (
    <div className="mt-1.5">
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowMenu(m => !m)}
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            <Languages size={13} />
            Translate
          </button>
          {showMenu && (
            <div
              className="absolute left-0 top-6 w-40 bg-yt-surface border border-yt-border rounded-xl shadow-2xl overflow-hidden z-30 max-h-48 overflow-y-auto"
              onMouseLeave={() => setShowMenu(false)}
            >
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleTranslate(lang.code, lang.name)}
                  className="flex items-center w-full px-3 py-2 text-xs hover:bg-yt-surface2 transition-colors text-left text-yt-text"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
        {translated && (
          <button
            onClick={() => setTranslated('')}
            className="text-xs text-yt-muted hover:text-white transition-colors flex items-center gap-1"
          >
            <X size={11} /> Hide
          </button>
        )}
      </div>
      {translating && (
        <div className="flex items-center gap-2 mt-1.5 text-xs text-yt-muted">
          <Loader2 size={12} className="animate-spin" />
          Translating to {selectedLangName}...
        </div>
      )}
      {translated && !translating && (
        <div className="mt-2 p-2.5 bg-yt-surface rounded-lg border border-yt-border">
          <p className="text-xs text-yt-muted mb-1">Translated to {selectedLangName}:</p>
          <p className="text-sm leading-relaxed">{translated}</p>
        </div>
      )}
    </div>
  );
}

// ── Report Dialog ─────────────────────────────────────────
function ReportDialog({ commentId, onClose, onReport }: {
  commentId: string;
  onClose: () => void;
  onReport: () => void;
}) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleReport = async () => {
    if (!reason) return;
    setSubmitting(true);
    await fetch('/api/moderate', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId, reason }),
    });
    setSubmitting(false);
    setDone(true);
    setTimeout(() => { onReport(); onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-yt-surface2 rounded-2xl p-6 w-full max-w-sm">
        {done ? (
          <div className="text-center py-4">
            <ShieldAlert size={36} className="text-yellow-400 mx-auto mb-3" />
            <p className="font-semibold">Comment reported!</p>
            <p className="text-sm text-yt-muted mt-1">It will be reviewed by our team.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Flag size={18} className="text-red-400" />
              <h2 className="text-base font-semibold">Report comment</h2>
            </div>
            <p className="text-sm text-yt-muted mb-3">Why are you reporting this comment?</p>
            <div className="space-y-2 mb-4">
              {REPORT_REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                    reason === r ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yt-surface hover:bg-yt-border text-yt-text'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 bg-yt-surface hover:bg-yt-border rounded-xl text-sm font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reason || submitting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Reply Item ────────────────────────────────────────────
function ReplyItem({ reply }: { reply: Reply }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(reply.likes);
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);

  return (
    <div className="flex gap-3 mt-4">
      {reply.avatar ? (
        <img src={reply.avatar} alt={reply.user} style={{ width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '28px', height: '28px', minWidth: '28px' }} className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {reply.user?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium">{reply.user}</span>
          <span className="text-xs text-yt-muted">{formatDate(reply.createdAt)}</span>
          {reply.showLocation && reply.location && (
            <span className="flex items-center gap-0.5 text-xs text-yt-muted">
              <MapPin size={10} /> {reply.location}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed">{reply.text}</p>
        <Translator text={reply.text} />
        <div className="flex items-center gap-3 mt-2">
          <button onClick={() => { if (liked) { setLiked(false); setLikes(l => l - 1); } else { setLiked(true); setLikes(l => l + 1); if (disliked) setDisliked(false); } }} className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-white' : 'text-yt-muted hover:text-white'}`}>
            <ThumbsUp size={13} className={liked ? 'fill-white' : ''} />
            {likes > 0 && <span>{formatLikes(likes)}</span>}
          </button>
          <button onClick={() => { if (disliked) setDisliked(false); else { setDisliked(true); if (liked) { setLiked(false); setLikes(l => l - 1); } } }} className={`flex items-center gap-1.5 text-xs transition-colors ${disliked ? 'text-white' : 'text-yt-muted hover:text-white'}`}>
            <ThumbsDown size={13} className={disliked ? 'fill-white' : ''} />
          </button>
          {!reported && (
            <button onClick={() => setShowReport(true)} className="text-xs text-yt-muted hover:text-red-400 transition-colors">
              <Flag size={12} />
            </button>
          )}
          {reported && <span className="text-xs text-yellow-500 flex items-center gap-1"><AlertTriangle size={11} /> Reported</span>}
        </div>
        {showReport && (
          <ReportDialog
            commentId={reply._id}
            onClose={() => setShowReport(false)}
            onReport={() => setReported(true)}
          />
        )}
      </div>
    </div>
  );
}

// ── Comment Item ──────────────────────────────────────────
function CommentItem({ comment, isOwn, onDelete, videoId }: {
  comment: Comment;
  isOwn: boolean;
  onDelete: (id: string) => void;
  videoId: string;
}) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const [showReplies, setShowReplies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Reply[]>(comment.replies || []);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(comment.reported || false);
  const [flagged, setFlagged] = useState(comment.reported || false);

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setReplyError('');

    // Moderate reply
    const check = await moderateComment(replyText);
    if (!check.allowed) {
      setReplyError(check.reason);
      return;
    }

    setSubmittingReply(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          userId: 'guest',
          user: 'You',
          avatar: '',
          text: replyText.trim(),
          parentId: comment._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReplies(prev => [...prev, data.comment]);
        setReplyText('');
        setReplying(false);
        setShowReplies(true);
      }
    } catch (err) {
      console.error('Reply error:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDelete = async () => {
    await fetch(`/api/comments?id=${comment._id}`, { method: 'DELETE' });
    onDelete(comment._id);
    setShowMenu(false);
  };

  return (
    <div className="flex gap-3 group">
      {comment.avatar ? (
        <img src={comment.avatar} alt={comment.user} style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '36px', height: '36px', minWidth: '36px' }} className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
          {comment.user?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        {comment.pinned && (
          <div className="flex items-center gap-1.5 mb-2">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" className="text-yt-muted">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
            </svg>
            <span className="text-xs text-yt-muted font-medium">Pinned comment</span>
          </div>
        )}

        {/* Reported/flagged banner */}
        {flagged && (
          <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0" />
            <span className="text-xs text-yellow-400">This comment has been flagged for review</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium">{comment.user}</span>
          <span className="text-xs text-yt-muted">{formatDate(comment.createdAt)}</span>
          {comment.showLocation && comment.location && (
            <span className="flex items-center gap-0.5 text-xs text-yt-muted">
              <MapPin size={10} /> {comment.location}
            </span>
          )}
          {comment.edited && <span className="text-xs text-yt-muted">(edited)</span>}
        </div>

        <p className="text-sm leading-relaxed">{comment.text}</p>
        <Translator text={comment.text} />

        <div className="flex items-center gap-3 mt-2">
          <button onClick={() => { if (liked) { setLiked(false); setLikes(l => l - 1); } else { setLiked(true); setLikes(l => l + 1); if (disliked) setDisliked(false); } }} className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-white' : 'text-yt-muted hover:text-white'}`}>
            <ThumbsUp size={14} className={liked ? 'fill-white' : ''} />
            {likes > 0 && <span>{formatLikes(likes)}</span>}
          </button>
          <button onClick={() => { if (disliked) setDisliked(false); else { setDisliked(true); if (liked) { setLiked(false); setLikes(l => l - 1); } } }} className={`flex items-center gap-1.5 text-xs transition-colors ${disliked ? 'text-white' : 'text-yt-muted hover:text-white'}`}>
            <ThumbsDown size={14} className={disliked ? 'fill-white' : ''} />
          </button>
          <button onClick={() => setReplying(r => !r)} className="text-xs text-yt-muted hover:text-white font-medium transition-colors">
            Reply
          </button>
          {!reported && !isOwn && (
            <button onClick={() => setShowReport(true)} className="text-xs text-yt-muted hover:text-red-400 transition-colors flex items-center gap-1">
              <Flag size={12} /> Report
            </button>
          )}
          {reported && !isOwn && (
            <span className="text-xs text-yellow-500 flex items-center gap-1">
              <AlertTriangle size={11} /> Reported
            </span>
          )}

          {/* Context menu */}
          <div className="relative ml-auto">
            <button onClick={() => setShowMenu(m => !m)} className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-yt-surface transition-all">
              <MoreVertical size={15} className="text-yt-muted" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-7 w-44 bg-yt-surface border border-yt-border rounded-xl shadow-2xl overflow-hidden z-20" onMouseLeave={() => setShowMenu(false)}>
                {isOwn ? (
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors text-red-400" onClick={handleDelete}>
                    <Trash2 size={15} /> Delete
                  </button>
                ) : (
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors" onClick={() => { setShowReport(true); setShowMenu(false); }}>
                    <Flag size={15} className="text-yt-muted" /> Report
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply input */}
        {replying && (
          <div className="mt-3 flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">Y</div>
            <div className="flex-1">
              <input
                autoFocus
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') submitReply(); if (e.key === 'Escape') setReplying(false); }}
                placeholder={`Reply to @${comment.user}...`}
                className="w-full bg-transparent border-b border-yt-border pb-1.5 text-sm placeholder-yt-muted focus:outline-none focus:border-white transition-colors"
              />
              {replyError && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle size={11} /> {replyError}
                </p>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => { setReplying(false); setReplyError(''); }} className="px-3 py-1.5 text-xs font-medium rounded-full hover:bg-yt-surface transition-colors">Cancel</button>
                <button onClick={submitReply} disabled={!replyText.trim() || submittingReply} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-colors">
                  {submittingReply && <Loader2 size={12} className="animate-spin" />}
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {replies.length > 0 && (
          <button onClick={() => setShowReplies(r => !r)} className="flex items-center gap-1.5 mt-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
            {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
          </button>
        )}

        {showReplies && (
          <div className="ml-1 border-l border-yt-border pl-4 mt-1">
            {replies.map(reply => <ReplyItem key={reply._id} reply={reply} />)}
          </div>
        )}

        {showReport && (
          <ReportDialog
            commentId={comment._id}
            onClose={() => setShowReport(false)}
            onReport={() => { setReported(true); setFlagged(true); }}
          />
        )}
      </div>
    </div>
  );
}

// ── Main Comments ─────────────────────────────────────────
export default function Comments({ videoId }: { videoId?: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [sortBy, setSortBy] = useState('Top comments');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    if (!videoId) return;
    fetch(`/api/comments?videoId=${videoId}&sort=${sortBy === 'Top comments' ? 'top' : 'new'}`)
      .then(res => res.json())
      .then(data => { if (data.success) setComments(data.comments); setLoading(false); })
      .catch(() => setLoading(false));
  }, [videoId, sortBy]);

  const handleSubmit = async () => {
    if (!commentText.trim() || !videoId) return;
    setCommentError('');

    // Moderate before posting
    const check = await moderateComment(commentText);
    if (!check.allowed) {
      setCommentError(check.reason);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          userId: 'guest',
          user: 'You',
          avatar: '',
          text: commentText.trim(),
          showLocation,
          location: showLocation ? 'India' : '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [{ ...data.comment, replies: [] }, ...prev]);
        setCommentText('');
        setInputFocused(false);
        setCommentError('');
      }
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => setComments(prev => prev.filter(c => c._id !== id));

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <h2 className="text-lg font-semibold">
          {loading ? 'Comments' : `${comments.length.toLocaleString()} Comments`}
        </h2>
        <div className="relative">
          <button onClick={() => setShowSortMenu(m => !m)} className="flex items-center gap-2 text-sm font-medium hover:text-yt-muted transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 18h17v-2H4v2zm0-5h17v-2H4v2zM4 6v2h17V6H4z"/></svg>
            Sort by
          </button>
          {showSortMenu && (
            <div className="absolute left-0 top-8 w-44 bg-yt-surface border border-yt-border rounded-xl shadow-2xl overflow-hidden z-20" onMouseLeave={() => setShowSortMenu(false)}>
              {SORT_OPTIONS.map(opt => (
                <button key={opt} onClick={() => { setSortBy(opt); setShowSortMenu(false); }} className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors ${sortBy === opt ? 'text-white font-medium' : 'text-yt-text'}`}>
                  {sortBy === opt && <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                  <span className={sortBy === opt ? '' : 'ml-6'}>{opt}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment input */}
      <div className="flex gap-3 mb-8">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm flex-shrink-0">Y</div>
        <div className="flex-1">
          <input
            type="text"
            value={commentText}
            onChange={e => { setCommentText(e.target.value); setCommentError(''); }}
            onFocus={() => setInputFocused(true)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-yt-border pb-2 text-sm placeholder-yt-muted focus:outline-none focus:border-white transition-colors"
          />
          {commentError && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">{commentError}</p>
            </div>
          )}
          {inputFocused && (
            <>
              {/* Location toggle */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setShowLocation(s => !s)}
                  className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-colors ${
                    showLocation ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-yt-muted hover:text-white border border-yt-border'
                  }`}
                >
                  <MapPin size={11} />
                  {showLocation ? 'Location shown' : 'Add location (optional)'}
                </button>
                {showLocation && <span className="text-xs text-yt-muted">Your country will be shown</span>}
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => { setInputFocused(false); setCommentText(''); setCommentError(''); }} className="px-4 py-2 text-sm font-medium rounded-full hover:bg-yt-surface transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={!commentText.trim() || submitting} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-colors">
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Comment
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-9 h-9 rounded-full shimmer flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 shimmer rounded w-1/4" />
                <div className="h-3 shimmer rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && comments.length === 0 && (
        <div className="text-center py-10">
          <p className="text-yt-muted text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              isOwn={comment.user === 'You'}
              onDelete={handleDelete}
              videoId={videoId || ''}
            />
          ))}
        </div>
      )}
    </div>
  );
}
