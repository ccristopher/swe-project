'use client';

import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import { ArrowRight, BookOpen, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import styles from './home-page-content.module.css';
import Link from "next/link";

export function HomePageContent() {
  return (
    <section className="px-6 pb-16 pt-6 sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
            Build a reading habit that feels <span className="text-primary">fun</span>, social, and
            easy to keep!
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-on-surface-variant">
            Log books, unlock pets and accessories, and make reading feel rewarding.
          </p>

          <AuthActions />
        </div>

        <div className="flex items-center justify-center">
          <PetPreviewCard />
        </div>
      </div>
    </section>
  );
}

function AuthActions() {
  const { isSignedIn } = useUser();

  return (
    <div className="mt-10 flex w-full max-w-xl flex-col gap-4">
      {!isSignedIn && (
        <>
        <SignUpButton mode="modal">
          <Button
            className={`h-16 rounded-full px-8 font-display text-xl font-bold text-accent-foreground cursor-pointer ${styles.primaryAction}`}
          >
            Get started
            <ArrowRight className="size-5" />
          </Button>
        </SignUpButton>

        <SignInButton mode="modal">
          <Button
            variant="outline"
            className={`h-16 rounded-full border-transparent bg-surface-container-low px-8 font-display text-xl font-bold text-foreground hover:bg-surface-container cursor-pointer ${styles.secondaryAction}`}
          >
            I already have an account
          </Button>
        </SignInButton>
        </>
      )}

      {isSignedIn && (
        <Link
          href="/profile"
          className={`h-16 rounded-full px-8 font-display text-xl font-bold text-accent-foreground ${styles.primaryAction} flex items-center justify-center`}
        >
          Go to Profile
        </Link>
      )}
    </div>
  );
}

function PetPreviewCard() {
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute -left-8 top-10 size-28 rounded-full bg-secondary-container/70 blur-2xl" />
      <div className="absolute -right-4 bottom-6 size-40 rounded-full bg-tertiary-container/30 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2.5rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              Your Pet
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
              Mochi
            </h2>
          </div>

          <div className="rounded-full bg-accent px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-accent-foreground">
            Level 24
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-center">
          <div className={`relative flex min-h-90 items-center justify-center rounded-[2.25rem] px-6 py-8 ${styles.petStage}`}>
            <div className={`absolute inset-0 rounded-4xl ${styles.petStageGlow}`} />

            <div className={`absolute -right-2 top-10 flex size-14 rotate-12 items-center justify-center rounded-full shadow-lg ${styles.starBadge}`}>
              <Star className="size-6" />
            </div>

            <div className="relative z-10 flex w-full justify-center">
              <Image
                src="/placeholder_pet.png"
                alt="Pet companion illustration"
                width={280}
                height={330}
                className="h-auto w-full max-w-70 object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] bg-surface-container-highest p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">
                This week
              </p>
              <p className={`mt-2 font-display text-4xl font-black tracking-tight ${styles.statValue}`}>
                3 books
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-surface-container-highest p-5">
              <div className="flex items-end justify-between gap-4">
                <p className={`whitespace-nowrap text-sm font-bold ${styles.progressLabel}`}>
                  Next Lvl Progress
                </p>
                <p className={`whitespace-nowrap font-display text-sm font-black ${styles.progressValue}`}>
                  10 / 12
                </p>
              </div>

              <div className="mt-4 h-4 overflow-hidden rounded-full bg-surface">
                <div className="h-full w-[83%] rounded-full bg-primary" />
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-tertiary-container/60 p-5 text-foreground">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em]">
                <BookOpen className="size-4 text-tertiary" />
                Reading streak
              </div>

              <p className={`mt-2 text-base leading-7 ${styles.streakCopy}`}>
                14-day streak. Keep reading to unlock your next reward!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
