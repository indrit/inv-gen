'use client';

import { APP_NAME } from '@/lib/constants';
import { useUserProfile } from '@/firebase/firestore/use-user-profile';
import Link from 'next/link';

export default function Footer() {
  const { profile } = useUserProfile();
  const isPremium = profile?.isPremium === true;

  // Even premium users should see legal links, but maybe a more minimal footer
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-gray-900 tracking-tight mb-1">
              &copy; {new Date().getFullYear()} {APP_NAME}.
            </p>
            {!isPremium && (
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                The world's simplest invoice generator.
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <a 
                href="mailto:indritzaganjori@gmail.com?subject=Problem%20Report%20-%20Invoice%20Generator" 
                className="text-primary hover:underline font-semibold flex items-center gap-2"
            >
              Report a Problem
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
