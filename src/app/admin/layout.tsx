'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user state is resolved
    }
    // This is a simple email check for admin access.
    // For more robust security, this should be handled with Firebase Custom Claims.
    if (!user || user.email !== 'indritzaganjori@gmail.com') {
      router.replace('/'); // Redirect non-admins to the homepage
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || user.email !== 'indritzaganjori@gmail.com') {
    // Show a loading spinner while verifying auth and before redirecting
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is the admin, render the children (the admin page)
  return <>{children}</>;
}
