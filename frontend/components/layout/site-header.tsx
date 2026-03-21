'use client';

import { UserButton, useUser } from '@clerk/nextjs';

export function SiteHeader() {
  const { isSignedIn } = useUser();

  return (
    <header className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-6 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_0_0_var(--brand-shadow)]" />

        <div>
          <p className="font-display text-[2rem] font-extrabold tracking-tight text-primary">
            Pet &amp; Prose
          </p>
        </div>
      </div>

      {isSignedIn && (
        <div className="flex size-12 items-center justify-center rounded-full border-2 border-primary/20 bg-primary-container">
          <UserButton />
        </div>
      )}
    </header>
  );
}
