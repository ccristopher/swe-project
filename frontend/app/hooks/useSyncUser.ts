// frontend/app/hooks/useSyncUser.ts
'use client'

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function useSyncUser() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;

    void fetch('/api/users', { method: 'POST' }).catch((error) => {
      console.error('Failed to sync user:', error);
    });
  }, [isSignedIn]);
}