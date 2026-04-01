'use client';

import { UserButton, useUser } from '@clerk/nextjs';

export function SiteHeader() {
  const { isSignedIn } = useUser();

  return (
    <header className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-6 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_0_0_var(--brand-shadow)]" />

        <div>
          <p className="font-display text-[2rem] font-extrabold tracking-tight text-foreground">
            Pet &amp; Prose
          </p>
        </div>
      </div>

      {isSignedIn && (
        <div
          className="flex size-11 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(38,70,83,0.08)] dark:bg-surface-container-low dark:shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
        >
          <UserButton />
        </div>
      )}
    </header>
  );
}
