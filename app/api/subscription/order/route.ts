import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourSecretHere',
});

const PLANS = {
  bronze: { amount: 9900, name: 'Bronze Plan', downloads: 5 },
  silver: { amount: 19900, name: 'Silver Plan', downloads: 15 },
  gold: { amount: 49900, name: 'Gold Plan', downloads: 999 },
};

export async function POST(req: NextRequest) {
  try {
    const { plan, userId = 'guest' } = await req.json();

    if (!PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    const order = await razorpay.orders.create({
      amount: selectedPlan.amount,
      currency: 'INR',
      receipt: `receipt_${userId}_${plan}_${Date.now()}`,
      notes: { plan, userId, planName: selectedPlan.name },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: selectedPlan.amount,
      currency: 'INR',
      plan,
      planName: selectedPlan.name,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
    });
  } catch (error) {
    console.error('Razorpay order error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
