'use client';

import { ClerkProvider, Show, UserButton } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import useSyncUser from './hooks/useSyncUser';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background antialiased">
        <ClerkProvider>
          <LayoutContent>{children}</LayoutContent>
        </ClerkProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  useSyncUser();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);
    };

    applyTheme(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyTheme(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_0_0_#5737d9]">
          </div>
          <div>
            <p className="font-display text-[2rem] font-extrabold tracking-tight text-primary">
              Pet &amp; Prose
            </p>
          </div>
        </div>

        <Show when="signed-out">
          <div />
        </Show>

        <Show when="signed-in">
          <div className="flex size-12 items-center justify-center rounded-full border-2 border-primary/20 bg-primary-container">
            <UserButton />
          </div>
        </Show>
      </header>

      <main>{children}</main>
    </div>
  );
}
