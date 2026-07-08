import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import mongoose, { Schema } from 'mongoose';

const SubscriptionSchema = new Schema({
  userId: { type: String, required: true },
  plan: { type: String, required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Subscription = mongoose.models.Subscription2 ||
  mongoose.model('Subscription2', SubscriptionSchema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      amount,
      userId = 'guest',
    } = await req.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YourSecretHere')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    // Calculate end date (1 month)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Save subscription to DB
    const subscription = await Subscription.create({
      userId,
      plan,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
      status: 'active',
      startDate: new Date(),
      endDate,
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: `Successfully upgraded to ${plan} plan!`,
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 500 });
  }
}
