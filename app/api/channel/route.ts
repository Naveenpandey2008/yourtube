import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose, { Schema } from 'mongoose';

const ChannelSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  handle: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  avatar: { type: String, default: '' },
  banner: { type: String, default: '' },
  category: { type: String, default: 'General' },
  type: { type: String, default: 'Personal' },
  subscribers: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Channel = mongoose.models.Channel ||
  mongoose.model('Channel', ChannelSchema);

// GET /api/channel?userId=xxx or ?handle=xxx
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const handle = searchParams.get('handle');

    let channel;
    if (userId) {
      channel = await Channel.findOne({ userId }).lean();
    } else if (handle) {
      channel = await Channel.findOne({ handle }).lean();
    } else {
      const channels = await Channel.find().lean();
      return NextResponse.json({ success: true, channels });
    }

    if (!channel) {
      return NextResponse.json({ success: false, error: 'Channel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, channel });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch channel' }, { status: 500 });
  }
}

// POST /api/channel — create a new channel
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId = 'guest', name, handle, description, avatar, category, type } = body;

    if (!name || !handle) {
      return NextResponse.json({ success: false, error: 'Name and handle are required' }, { status: 400 });
    }

    // Check if handle already exists
    const existing = await Channel.findOne({ handle });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Handle already taken' }, { status: 409 });
    }

    const channel = await Channel.create({
      userId,
      name,
      handle,
      description,
      avatar,
      category,
      type,
    });

    return NextResponse.json({ success: true, channel }, { status: 201 });
  } catch (error) {
    console.error('Channel create error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create channel' }, { status: 500 });
  }
}

// PATCH /api/channel — update channel
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    const channel = await Channel.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true }
    );

    if (!channel) {
      return NextResponse.json({ success: false, error: 'Channel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, channel });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update channel' }, { status: 500 });
  }
}
