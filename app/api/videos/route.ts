import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';

// GET /api/videos — fetch all videos or search
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    let filter: any = {};

    if (query) {
      filter.$text = { $search: query };
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const videos = await Video.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Video.countDocuments(filter);

    return NextResponse.json({
      success: true,
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/videos error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch videos' }, { status: 500 });
  }
}

// POST /api/videos — create a new video
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, description, thumbnail, videoUrl, channel, channelId, channelAvatar, duration, tags, category } = body;

    if (!title || !thumbnail || !channel || !channelId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const video = await Video.create({
      title,
      description,
      thumbnail,
      videoUrl,
      channel,
      channelId,
      channelAvatar,
      duration,
      tags,
      category,
    });

    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (error) {
    console.error('POST /api/videos error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create video' }, { status: 500 });
  }
}