'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InvoiceEditor from '@/components/invoice/InvoiceEditor';
import { Loader2 } from 'lucide-react';
import PwaBanner from '@/components/pwa/PwaBanner';
import AdSense from '@/components/ads/AdSense';
import { useUserProfile } from '@/firebase/firestore/use-user-profile';

function InvoicePageContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  const { profile } = useUserProfile();
  const isPremium = profile?.isPremium === true;

  if (isPremium) {
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-4xl py-8">
                <InvoiceEditor clientId={clientId ?? undefined} />
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top Horizontal Ad */}
      <div className="w-full max-w-4xl mx-auto">
        <AdSense adSlot="7503131866" className="my-0" />
      </div>
      
      <div className="flex flex-col xl:flex-row gap-6 items-start justify-center">
        {/* Left Side Vertical Ad - Only on large screens */}
        <div className="hidden xl:block w-[160px] flex-shrink-0 sticky top-24">
          <AdSense adSlot="1686135305" className="my-0" />
        </div>

        <div className="flex-1 w-full max-w-4xl">
          <InvoiceEditor clientId={clientId ?? undefined} />
        </div>

        {/* Right Side Vertical Ad - Only on large screens */}
        <div className="hidden xl:block w-[160px] flex-shrink-0 sticky top-24">
          <AdSense adSlot="1686135305" className="my-0" />
        </div>
      </div>

      {/* Bottom Horizontal Ad */}
      <div className="w-full max-w-4xl mx-auto">
        <AdSense adSlot="7503131866" className="my-0" />
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
       <Suspense fallback={<div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <InvoicePageContent />
      </Suspense>
      <div className="max-w-4xl mx-auto mt-8">
        <PwaBanner />
      </div>
    </div>
  );
}
