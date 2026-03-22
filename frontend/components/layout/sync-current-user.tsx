'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function SyncCurrentUser() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    void fetch('/api/users', { method: 'POST' }).catch((error) => {
      console.error('Failed to sync user:', error);
    });
  }, [isLoaded, isSignedIn]);

  return null;
}
