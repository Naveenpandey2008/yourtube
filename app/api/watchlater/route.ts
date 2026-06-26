import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose, { Schema } from 'mongoose';

// WatchLater Schema
const WatchLaterSchema = new Schema({
  userId: { type: String, required: true },
  videoId: { type: String, required: true },
  title: String,
  thumbnail: String,
  channel: String,
  duration: String,
  views: Number,
  createdAt: { type: Date, default: Date.now },
});

const WatchLater = mongoose.models.WatchLater || mongoose.model('WatchLater', WatchLaterSchema);

// GET /api/watchlater?userId=xxx — get all watch later videos
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'guest';

    const videos = await WatchLater.find({ userId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch watch later' }, { status: 500 });
  }
}

// POST /api/watchlater — add video to watch later
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId = 'guest', videoId, title, thumbnail, channel, duration, views } = body;

    // Check if already exists
    const existing = await WatchLater.findOne({ userId, videoId });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Already in Watch Later' }, { status: 409 });
    }

    const video = await WatchLater.create({ userId, videoId, title, thumbnail, channel, duration, views });

    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add to watch later' }, { status: 500 });
  }
}

// DELETE /api/watchlater?userId=xxx&videoId=xxx — remove from watch later
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'guest';
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ success: false, error: 'videoId is required' }, { status: 400 });
    }

    await WatchLater.findOneAndDelete({ userId, videoId });

    return NextResponse.json({ success: true, message: 'Removed from Watch Later' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to remove from watch later' }, { status: 500 });
  }
}
