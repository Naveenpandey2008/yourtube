import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';

// GET /api/comments?videoId=xxx — get comments for a video
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');
    const sort = searchParams.get('sort') || 'top';

    if (!videoId) {
      return NextResponse.json({ success: false, error: 'videoId is required' }, { status: 400 });
    }

    const sortOrder = sort === 'top' ? { likes: -1 } : { createdAt: -1 };

    // Get top level comments only
    const comments = await Comment.find({ videoId, parentId: null })
      .sort(sortOrder)
      .lean();

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentId: comment._id.toString() })
          .sort({ createdAt: 1 })
          .lean();
        return { ...comment, replies };
      })
    );

    const total = await Comment.countDocuments({ videoId, parentId: null });

    return NextResponse.json({ success: true, comments: commentsWithReplies, total });
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/comments — add a comment or reply
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { videoId, userId, user, avatar, text, parentId } = body;

    if (!videoId || !userId || !user || !text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const comment = await Comment.create({
      videoId,
      userId,
      user,
      avatar,
      text,
      parentId: parentId || null,
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error('POST /api/comments error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 });
  }
}

// DELETE /api/comments?id=xxx — delete a comment
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Comment id is required' }, { status: 400 });
    }

    await Comment.findByIdAndDelete(id);
    // Also delete replies
    await Comment.deleteMany({ parentId: id });

    return NextResponse.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete comment' }, { status: 500 });
  }
}
