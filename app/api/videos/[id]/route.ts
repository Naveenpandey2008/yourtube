import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';

// GET /api/videos/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const video = await Video.findById(id).lean();
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return NextResponse.json({ success: true, video });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch video' }, { status: 500 });
  }
}

// PATCH /api/videos/[id]
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();
    const video = await Video.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, video });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE /api/videos/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete video' }, { status: 500 });
  }
}