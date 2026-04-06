'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay to make it feel less intrusive on first load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
     localStorage.setItem('cookie-consent', 'false');
     setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[420px] bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500 ring-1 ring-black/5">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-xl shrink-0">
          <Cookie className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg tracking-tight">Cookie Consent</h3>
            <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed pr-2">
            We use cookies to enhance your experience, serve personalized ads, and analyze our traffic. By clicking "Accept", you consent to our use of cookies. Read our <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link> for more details.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-11 text-gray-600 border-gray-200 hover:bg-gray-50 font-semibold"
            onClick={handleDecline}
        >
          Decline
        </Button>
        <Button 
            size="sm" 
            className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
            onClick={handleAccept}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
