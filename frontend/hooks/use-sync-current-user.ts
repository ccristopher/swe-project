'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

export function useSyncCurrentUser() {
  const { isLoaded, isSignedIn } = useUser();
  const hasRequestedSyncRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      hasRequestedSyncRef.current = false;
      return;
    }

    if (hasRequestedSyncRef.current) return;

    hasRequestedSyncRef.current = true;

    void fetch('/api/users', { method: 'POST' }).catch((error) => {
      hasRequestedSyncRef.current = false;
      console.error('Failed to sync user:', error);
    });
  }, [isLoaded, isSignedIn]);
}
