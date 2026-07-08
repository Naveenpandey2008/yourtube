'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Crown, Check, Zap, Download, Shield, Star, Loader2, CheckCircle2 } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceDisplay: '₹0',
    period: 'forever',
    color: 'text-gray-400',
    borderColor: 'border-yt-border',
    bgColor: 'bg-transparent',
    buttonClass: 'bg-yt-surface hover:bg-yt-border text-yt-text',
    features: ['1 download per day', 'Standard video quality', 'Basic search', 'Comments & likes', 'Watch history'],
    notIncluded: ['Ad-free viewing', 'HD downloads', 'Priority support'],
  },
  {
    id: 'bronze',
    name: 'Bronze',
    price: 99,
    priceDisplay: '₹99',
    period: 'per month',
    color: 'text-orange-400',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/5',
    buttonClass: 'bg-orange-500 hover:bg-orange-400 text-white',
    features: ['5 downloads per day', 'HD video quality', 'Advanced search', 'Comments & likes', 'Watch history', 'Ad-free viewing'],
    notIncluded: ['Priority support', 'Exclusive content'],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 199,
    priceDisplay: '₹199',
    period: 'per month',
    color: 'text-gray-300',
    borderColor: 'border-gray-400',
    bgColor: 'bg-gray-400/5',
    buttonClass: 'bg-gray-500 hover:bg-gray-400 text-white',
    popular: true,
    features: ['15 downloads per day', 'Full HD 1080p', 'Advanced search', 'Comments & likes', 'Watch history', 'Ad-free viewing', 'Priority support'],
    notIncluded: ['Exclusive content'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 499,
    priceDisplay: '₹499',
    period: 'per month',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-500/5',
    buttonClass: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white',
    features: ['Unlimited downloads', '4K video quality', 'Advanced search', 'Comments & likes', 'Watch history', 'Ad-free viewing', 'Priority support', 'Exclusive content', 'Early access'],
    notIncluded: [],
  },
];

declare global {
  interface Window { Razorpay: any; }
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [currentPlan] = useState('free');

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise(resolve => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;
    setLoading(planId);
    setError('');

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError('Failed to load payment gateway. Please try again.');
        setLoading(null);
        return;
      }

      const orderRes = await fetch('/api/subscription/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, userId: 'guest' }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        setError(orderData.error || 'Failed to create order');
        setLoading(null);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'YourTube',
        description: orderData.planName,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/subscription/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planId,
              amount: orderData.amount,
              userId: 'guest',
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) { setSuccess(planId); setLoading(null); }
          else { setError('Payment verification failed.'); setLoading(null); }
        },
        prefill: { name: 'Naveen Pandey', email: 'naveen@example.com' },
        theme: { color: '#FF0000' },
        modal: { ondismiss: () => setLoading(null) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown size={28} className="text-yellow-400" />
              <h1 className="text-3xl font-bold">Upgrade Your Plan</h1>
            </div>
            <p className="text-yt-muted text-base max-w-xl mx-auto">
              Get more downloads, better quality, and exclusive features with our premium plans.
            </p>
          </div>

          {error && (
            <div className="max-w-md mx-auto mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {PLANS.map(plan => (
              <div key={plan.id} className={`relative rounded-2xl border-2 p-5 flex flex-col ${plan.borderColor} ${plan.bgColor} ${success === plan.id ? 'ring-2 ring-green-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yt-red text-white text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}
                {currentPlan === plan.id && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yt-surface border border-yt-border text-yt-muted text-xs font-medium rounded-full">
                    Current Plan
                  </div>
                )}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown size={20} className={plan.color} />
                    <h2 className={`text-lg font-bold ${plan.color}`}>{plan.name}</h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{plan.priceDisplay}</span>
                    <span className="text-sm text-yt-muted">/{plan.period}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 mb-5">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded?.map(feature => (
                    <div key={feature} className="flex items-start gap-2 opacity-40">
                      <Check size={14} className="text-yt-muted flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-yt-muted line-through">{feature}</span>
                    </div>
                  ))}
                </div>
                {success === plan.id ? (
                  <div className="flex items-center justify-center gap-2 py-2.5 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-medium">
                    <CheckCircle2 size={16} /> Activated!
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loading !== null || currentPlan === plan.id}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${plan.buttonClass}`}
                  >
                    {loading === plan.id && <Loader2 size={16} className="animate-spin" />}
                    {currentPlan === plan.id ? 'Current Plan' : plan.id === 'free' ? 'Free Forever' : `Upgrade to ${plan.name}`}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-yt-surface2 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-center">What you get with premium</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Download size={20} />, title: 'More Downloads', desc: 'Download up to unlimited videos per day based on your plan' },
                { icon: <Shield size={20} />, title: 'Ad-Free Experience', desc: 'Enjoy videos without any interruptions or advertisements' },
                { icon: <Star size={20} />, title: 'Priority Support', desc: 'Get faster response times and dedicated customer support' },
                { icon: <Zap size={20} />, title: 'HD Quality', desc: 'Stream and download videos in Full HD and 4K quality' },
                { icon: <Crown size={20} />, title: 'Exclusive Content', desc: 'Access premium videos not available to free users' },
                { icon: <CheckCircle2 size={20} />, title: 'Early Access', desc: 'Be the first to try new features before they are released' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3 p-3 bg-yt-surface rounded-xl">
                  <div className="text-yt-red flex-shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-yt-muted mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-yt-muted space-y-1">
            <p>🔒 Payments are secured by Razorpay. We never store your card details.</p>
            <p>All plans are billed monthly. Cancel anytime.</p>
            <p>Test mode: Use card 4111 1111 1111 1111, any future expiry, any CVV</p>
          </div>

        </div>
      </main>
    </div>
  );
}
