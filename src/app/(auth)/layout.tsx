'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user state is resolved
    }
    if (!user) {
      router.replace('/'); // Redirect unauthenticated users to the homepage
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    // Show a loading spinner while verifying auth and before redirecting
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is authenticated, render the children (the dashboard page)
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
