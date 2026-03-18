// frontend/app/hooks/useSyncUser.ts
'use client'

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function useSyncUser() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/users')
        .then(res => res.json())
        .then(data => console.log('User sync:', data));
    }
  }, [isSignedIn]);
}