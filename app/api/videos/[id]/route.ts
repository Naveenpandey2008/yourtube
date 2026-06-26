import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';

// GET /api/videos/[id] — get single video
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const video = await Video.findById(params.id).lean();

    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    // Increment views
    await Video.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch video' }, { status: 500 });
  }
}

// PATCH /api/videos/[id] — update video (likes etc)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();

    const video = await Video.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, video });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE /api/videos/[id] — delete video
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const video = await Video.findByIdAndDelete(params.id);

    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete video' }, { status: 500 });
  }
}
