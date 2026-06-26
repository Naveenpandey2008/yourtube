import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose, { Schema } from 'mongoose';

const SubscriptionSchema = new Schema({
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
  channelName: { type: String, required: true },
  channelAvatar: { type: String, default: '' },
  subscribers: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Subscription = mongoose.models.Subscription ||
  mongoose.model('Subscription', SubscriptionSchema);

// GET /api/subscriptions?userId=xxx
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'guest';

    const subscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, subscriptions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

// POST /api/subscriptions — subscribe to a channel
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId = 'guest', channelId, channelName, channelAvatar, subscribers } = body;

    if (!channelId || !channelName) {
      return NextResponse.json({ success: false, error: 'channelId and channelName are required' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await Subscription.findOne({ userId, channelId });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Already subscribed' }, { status: 409 });
    }

    const subscription = await Subscription.create({
      userId,
      channelId,
      channelName,
      channelAvatar,
      subscribers,
    });

    return NextResponse.json({ success: true, subscription }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to subscribe' }, { status: 500 });
  }
}

// DELETE /api/subscriptions?userId=xxx&channelId=xxx — unsubscribe
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'guest';
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json({ success: false, error: 'channelId is required' }, { status: 400 });
    }

    await Subscription.findOneAndDelete({ userId, channelId });

    return NextResponse.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
