'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  isPremium: boolean;
  createdAt: any;
  updatedAt: any;
}

export function useUserProfile() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const userDocRef = doc(firestore, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching user profile:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isAuthLoading, firestore]);

  return { profile, isLoading: isLoading || isAuthLoading, error };
}
