'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MoreVertical, Flag, Pencil, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface Reply {
  _id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  createdAt: string;
  liked?: boolean;
  disliked?: boolean;
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
  liked?: boolean;
  disliked?: boolean;
  replies: Reply[];
}

const SORT_OPTIONS = ['Top comments', 'Newest first'];

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

// ── Single Reply ──────────────────────────────────────────
function ReplyItem({ reply }: { reply: Reply }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(reply.likes);

  const handleLike = () => {
    if (liked) { setLiked(false); setLikes(l => l - 1); }
    else { setLiked(true); setLikes(l => l + 1); if (disliked) setDisliked(false); }
  };

  const handleDislike = () => {
    if (disliked) setDisliked(false);
    else { setDisliked(true); if (liked) { setLiked(false); setLikes(l => l - 1); } }
  };

  return (
    <div className="flex gap-3 mt-4">
      {reply.avatar ? (
        <img
          src={reply.avatar}
          alt={reply.user}
          style={{ width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ width: '28px', height: '28px', minWidth: '28px' }} className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {reply.user?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium">{reply.user}</span>
          <span className="text-xs text-yt-muted">{formatDate(reply.createdAt)}</span>
        </div>
        <p className="text-sm leading-relaxed">{reply.text}</p>
        <div className="flex items-center gap-3 mt-2">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-white' : 'text-yt-muted hover:text-white'}`}>
            <ThumbsUp size={13} className={liked ? 'fill-white' : ''} />
            {likes > 0 && <span>{formatLikes(likes)}</span>}
          </button>
          <button onClick={handleDislike} className={`flex items-center gap-1.5 text-xs transition-colors ${disliked ? 'text-white' : 'text-yt-muted hover:text-white'}`}>
            <ThumbsDown size={13} className={disliked ? 'fill-white' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Single Comment ────────────────────────────────────────
function CommentItem({
  comment,
  isOwn,
  onDelete,
  videoId,
}: {
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

  const handleLike = () => {
    if (liked) { setLiked(false); setLikes(l => l - 1); }
    else { setLiked(true); setLikes(l => l + 1); if (disliked) setDisliked(false); }
  };

  const handleDislike = () => {
    if (disliked) setDisliked(false);
    else { setDisliked(true); if (liked) { setLiked(false); setLikes(l => l - 1); } }
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
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
    try {
      await fetch(`/api/comments?id=${comment._id}`, { method: 'DELETE' });
      onDelete(comment._id);
      setShowMenu(false);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="flex gap-3 group">
      {comment.avatar ? (
        <img
          src={comment.avatar}
          alt={comment.user}
          style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', objectFit: 'cover' }}
        />
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
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{comment.user}</span>
          <span className="text-xs text-yt-muted">{formatDate(comment.createdAt)}</span>
          {comment.edited && <span className="text-xs text-yt-muted">(edited)</span>}
        </div>
        <p className="text-sm leading-relaxed">{comment.text}</p>
        <div className="flex items-center gap-3 mt-2">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-white' : 'text-yt-muted hover:text-white'}`}>
            <ThumbsUp size={14} className={liked ? 'fill-white' : ''} />
            {likes > 0 && <span>{formatLikes(likes)}</span>}
          </button>
          <button onClick={handleDislike} className={`flex items-center gap-1.5 text-xs transition-colors ${disliked ? 'text-white' : 'text-yt-muted hover:text-white'}`}>
            <ThumbsDown size={14} className={disliked ? 'fill-white' : ''} />
          </button>
          <button
            onClick={() => setReplying(r => !r)}
            className="text-xs text-yt-muted hover:text-white font-medium transition-colors"
          >
            Reply
          </button>
          <div className="relative ml-auto">
            <button
              onClick={() => setShowMenu(m => !m)}
              className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-yt-surface transition-all"
            >
              <MoreVertical size={15} className="text-yt-muted" />
            </button>
            {showMenu && (
              <div
                className="absolute right-0 top-7 w-44 bg-yt-surface border border-yt-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-20"
                onMouseLeave={() => setShowMenu(false)}
              >
                {isOwn ? (
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors text-red-400"
                    onClick={handleDelete}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                ) : (
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors">
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
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setReplying(false)} className="px-3 py-1.5 text-xs font-medium rounded-full hover:bg-yt-surface transition-colors">
                  Cancel
                </button>
                <button
                  onClick={submitReply}
                  disabled={!replyText.trim() || submittingReply}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingReply ? <Loader2 size={12} className="animate-spin" /> : null}
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Replies toggle */}
        {replies.length > 0 && (
          <button
            onClick={() => setShowReplies(r => !r)}
            className="flex items-center gap-1.5 mt-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
          </button>
        )}

        {showReplies && (
          <div className="ml-1 border-l border-yt-border pl-4 mt-1">
            {replies.map(reply => (
              <ReplyItem key={reply._id} reply={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Comments Component ───────────────────────────────
export default function Comments({ videoId }: { videoId?: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('Top comments');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Fetch comments from MongoDB
  useEffect(() => {
    if (!videoId) return;
    fetch(`/api/comments?videoId=${videoId}&sort=${sortBy === 'Top comments' ? 'top' : 'new'}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setComments(data.comments);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [videoId, sortBy]);

  const handleSubmit = async () => {
    if (!commentText.trim() || !videoId) return;
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
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [{ ...data.comment, replies: [] }, ...prev]);
        setCommentText('');
        setInputFocused(false);
      }
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setComments(prev => prev.filter(c => c._id !== id));
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <h2 className="text-lg font-semibold">
          {loading ? 'Comments' : `${comments.length.toLocaleString()} Comments`}
        </h2>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(m => !m)}
            className="flex items-center gap-2 text-sm font-medium hover:text-yt-muted transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M4 18h17v-2H4v2zm0-5h17v-2H4v2zM4 6v2h17V6H4z"/>
            </svg>
            Sort by
          </button>
          {showSortMenu && (
            <div
              className="absolute left-0 top-8 w-44 bg-yt-surface border border-yt-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-20"
              onMouseLeave={() => setShowSortMenu(false)}
            >
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setShowSortMenu(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-yt-surface2 transition-colors ${
                    sortBy === opt ? 'text-white font-medium' : 'text-yt-text'
                  }`}
                >
                  {sortBy === opt && (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                  <span className={sortBy === opt ? '' : 'ml-6'}>{opt}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment input */}
      <div className="flex gap-3 mb-8">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
          Y
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-yt-border pb-2 text-sm placeholder-yt-muted focus:outline-none focus:border-white transition-colors"
          />
          {inputFocused && (
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => { setInputFocused(false); setCommentText(''); }}
                className="px-4 py-2 text-sm font-medium rounded-full hover:bg-yt-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!commentText.trim() || submitting}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-9 h-9 rounded-full shimmer flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 shimmer rounded w-1/4" />
                <div className="h-3 shimmer rounded w-3/4" />
                <div className="h-3 shimmer rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && comments.length === 0 && (
        <div className="text-center py-10">
          <p className="text-yt-muted text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {/* Comments list */}
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
