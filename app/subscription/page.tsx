'use client';

import Navbar from '@/components/Navbar';
import PlansSection from '@/components/PlansSection';

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-yt-bg">
      <Navbar onMenuClick={() => {}} />
      <main className="pt-14 lg:pl-[72px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <PlansSection variant="full" />
        </div>
      </main>
    </div>
  );
}