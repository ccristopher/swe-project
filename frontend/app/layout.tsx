'use client';

import { ClerkProvider, Show, UserButton } from '@clerk/nextjs';
import React from 'react';
import useSyncUser from './hooks/useSyncUser';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">
        <ClerkProvider>
          <LayoutContent>{children}</LayoutContent>
        </ClerkProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  useSyncUser();

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-[1.15rem] border-2 border-black bg-white">
            <p className="text-base text-muted-foreground">
              logo
            </p>
          </div>
          <div>
            <p className="text-[2rem] font-semibold tracking-tight">Pet and Prose</p>
          </div>
        </div>

        <Show when="signed-out">
          <div />
        </Show>

        <Show when="signed-in">
          <div>
            <UserButton />
          </div>
        </Show>
      </header>

      <main>{children}</main>
    </div>
  );
}
