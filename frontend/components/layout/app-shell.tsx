'use client';

import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { SyncCurrentUser } from '@/components/layout/sync-current-user';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SyncCurrentUser />
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
}
