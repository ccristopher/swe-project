'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dash' },
  { href: '/books', label: 'Library' },
  { href: '/leaderboard', label: 'Social' },
  { href: '/profile', label: 'Profile' },
];

export function SiteHeader() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  return (
    <header className="mx-auto flex min-h-24 w-full max-w-7xl items-center justify-between gap-4 px-6 py-3 sm:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/Untitled_design-removebg-preview.png"
            alt="Pet & Prose logo"
            width={64}
            height={64}
            className="size-16 object-contain"
            priority
          />

          <div>
            <p className="font-display text-[2rem] font-extrabold tracking-tight text-foreground">
              Pet &amp; Prose
            </p>
          </div>
        </Link>

        {isSignedIn && (
          <nav className="flex items-center gap-2 rounded-full bg-surface-container-low px-2 py-1">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {isSignedIn && (
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(38,70,83,0.08)] dark:bg-surface-container-low dark:shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
        >
          <UserButton />
        </div>
      )}
    </header>
  );
}
