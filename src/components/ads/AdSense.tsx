'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useUserProfile } from '@/firebase/firestore/use-user-profile';
import { cn } from '@/lib/utils';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  fullWidthResponsive?: boolean;
  className?: string;
}

/**
 * AdSense component that only renders if the user is NOT a premium subscriber.
 */
export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = ""
}: AdSenseProps) {
  const { profile, isLoading } = useUserProfile();
  const isPremium = profile?.isPremium === true;
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Only push if not premium and client ID exists
    if (!isPremium && !isLoading && adClient && !adLoaded) {
      let attempts = 0;
      const maxAttempts = 10;

      const pushAd = () => {
        try {
          if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
            // Check if the element is actually visible and has width
            if (adRef.current && adRef.current.offsetWidth > 0) {
              (window as any).adsbygoogle = (window as any).adsbygoogle || [];
              (window as any).adsbygoogle.push({});
              setAdLoaded(true);
            } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(pushAd, 500);
            }
          }
        } catch (e) {
          console.error('AdSense error:', e);
        }
      };

      // Small delay to ensure DOM is ready
      const timer = setTimeout(pushAd, 300);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isPremium, isLoading, adClient, adLoaded]);

  // Don't show anything if loading or if user is premium
  if (isLoading || isPremium || !adClient) {
    return null;
  }

  return (
    <div className={cn('flex justify-center overflow-hidden w-full', !className.includes('my-') && 'my-8', className)}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '250px', minHeight: '90px' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
