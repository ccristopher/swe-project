'use client';

import { useSyncCurrentUser } from '@/hooks/use-sync-current-user';

export function SyncCurrentUser() {
  useSyncCurrentUser();

  return null;
}
