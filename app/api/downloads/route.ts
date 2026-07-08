import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose, { Schema } from 'mongoose';

const DownloadSchema = new Schema({
  userId: { type: String, required: true },
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  channel: { type: String, default: '' },
  duration: { type: String, default: '0:00' },
  fileSize: { type: String, default: '' },
  downloadDate: { type: Date, default: Date.now },
  plan: { type: String, default: 'free' },
});

const Download = mongoose.models.Download || mongoose.model('Download', DownloadSchema);

const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  bronze: 5,
  silver: 15,
  gold: 999,
};

// GET /api/downloads?userId=xxx
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'guest';

    const downloads = await Download.find({ userId }).sort({ downloadDate: -1 }).lean();

    // Count today's downloads
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = downloads.filter(d => new Date(d.downloadDate) >= today).length;

    return NextResponse.json({ success: true, downloads, todayCount });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch downloads' }, { status: 500 });
  }
}

// POST /api/downloads — download a video
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId = 'guest', videoId, title, thumbnail, channel, duration, plan = 'free' } = body;

    if (!videoId || !title) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDownloads = await Download.countDocuments({
      userId,
      downloadDate: { $gte: today },
    });

    const limit = PLAN_LIMITS[plan] || 1;

    if (todayDownloads >= limit) {
      return NextResponse.json({
        success: false,
        error: `Daily download limit reached`,
        limit,
        todayCount: todayDownloads,
        plan,
      }, { status: 429 });
    }

    // Check if already downloaded today
    const alreadyDownloaded = await Download.findOne({
      userId,
      videoId,
      downloadDate: { $gte: today },
    });

    if (alreadyDownloaded) {
      return NextResponse.json({
        success: false,
        error: 'You already downloaded this video today',
      }, { status: 409 });
    }

    const download = await Download.create({
      userId,
      videoId,
      title,
      thumbnail,
      channel,
      duration,
      plan,
      downloadDate: new Date(),
    });

    return NextResponse.json({
      success: true,
      download,
      remaining: limit - todayDownloads - 1,
    }, { status: 201 });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ success: false, error: 'Download failed' }, { status: 500 });
  }
}

// DELETE /api/downloads?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    await Download.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
