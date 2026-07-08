import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';

// Abusive words list
const BANNED_WORDS = [
  'spam', 'hate', 'abuse', 'stupid', 'idiot', 'fool', 'dumb',
  'loser', 'ugly', 'trash', 'garbage', 'scam', 'fake', 'kill',
  'die', 'racist', 'moron', 'jerk', 'worthless',
];

// Check for spam patterns
function isSpam(text: string): { spam: boolean; reason: string } {
  // Too many special characters
  const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  if (specialChars > text.length * 0.5 && text.length > 5) {
    return { spam: true, reason: 'Too many special characters' };
  }

  // Repeated characters like "hahahaha" or "!!!!!!"
  if (/(.)\1{4,}/.test(text)) {
    return { spam: true, reason: 'Repeated characters detected' };
  }

  // ALL CAPS with more than 10 chars
  if (text.length > 10 && text === text.toUpperCase() && /[A-Z]/.test(text)) {
    return { spam: true, reason: 'Excessive caps detected' };
  }

  // Too many URLs
  const urls = (text.match(/https?:\/\//g) || []).length;
  if (urls > 2) {
    return { spam: true, reason: 'Too many links' };
  }

  return { spam: false, reason: '' };
}

// Check for abusive words
function hasAbusiveWords(text: string): { abusive: boolean; word: string } {
  const lowerText = text.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (lowerText.includes(word)) {
      return { abusive: true, word };
    }
  }
  return { abusive: false, word: '' };
}

// POST /api/moderate — check comment before posting
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ allowed: false, reason: 'Comment cannot be empty' });
    }

    if (text.trim().length < 2) {
      return NextResponse.json({ allowed: false, reason: 'Comment is too short' });
    }

    // Check spam
    const spamCheck = isSpam(text);
    if (spamCheck.spam) {
      return NextResponse.json({ allowed: false, reason: spamCheck.reason });
    }

    // Check abusive words
    const abuseCheck = hasAbusiveWords(text);
    if (abuseCheck.abusive) {
      return NextResponse.json({
        allowed: false,
        reason: `Your comment contains inappropriate language`,
      });
    }

    return NextResponse.json({ allowed: true });
  } catch (error) {
    return NextResponse.json({ allowed: true }); // Allow on error
  }
}

// PATCH /api/moderate — report a comment
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { commentId, reason } = await req.json();

    if (!commentId) {
      return NextResponse.json({ success: false, error: 'commentId is required' }, { status: 400 });
    }

    // Flag the comment as reported
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: { reported: true, reportReason: reason || 'Inappropriate content' },
        $inc: { reportCount: 1 },
      },
      { new: true }
    );

    if (!comment) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Comment reported successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to report comment' }, { status: 500 });
  }
}
