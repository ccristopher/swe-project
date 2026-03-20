'use client';

import { Show, SignInButton, SignUpButton } from '@clerk/nextjs';
import Image from 'next/image';
import { ArrowRight, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <section className="px-6 pb-16 pt-6 sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
            Build a reading habit that feels{' '}
            <span className="text-primary">fun</span>, social, and engaging!
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-on-surface-variant">
            Log books, earn pets and accessories, and make reading feel rewarding instead of
            lonely or hard to keep up with.
          </p>

          <div className="mt-10 flex w-full max-w-xl flex-col gap-4">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <Button className="h-16 rounded-full bg-[linear-gradient(135deg,#6346e6,#a192ff)] px-8 font-display text-xl font-bold text-primary-foreground shadow-[0_5px_0_0_#5737d9] transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                  Get started
                  <ArrowRight className="size-5" />
                </Button>
              </SignUpButton>

              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="h-16 rounded-full border-transparent bg-surface-container-low px-8 font-display text-xl font-bold text-foreground shadow-[0_10px_24px_rgba(99,70,230,0.08)] transition-transform hover:-translate-y-0.5 hover:bg-surface-container active:translate-y-0 cursor-pointer"
                >
                  I already have an account
                </Button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <Button className="h-16 rounded-full bg-[linear-gradient(135deg,#6346e6,#a192ff)] px-8 font-display text-xl font-bold text-primary-foreground shadow-[0_5px_0_0_#5737d9]">
                You&apos;re signed in :)
              </Button>
            </Show>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-xl">
            <div className="absolute -left-8 top-10 size-28 rounded-full bg-secondary-container/70 blur-2xl" />
            <div className="absolute -right-4 bottom-6 size-40 rounded-full bg-tertiary-container/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] bg-surface-container-low p-6 shadow-[0_18px_40px_rgba(99,70,230,0.12)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                    Current Pet
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
                    Mochi
                  </h2>
                </div>
                <div className="rounded-full bg-secondary-container px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-on-secondary-container">
                  Level 24
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-center">
                <div className="relative flex min-h-90 items-center justify-center rounded-[2.25rem] bg-[radial-gradient(circle_at_top,#ffffff,#ece8dd_68%,#ddd6fb)] px-6 py-8">
                  <div className="absolute inset-0 rounded-4xl bg-[radial-gradient(circle_at_center,rgba(99,70,230,0.12),transparent_60%)]" />
                  <div className="absolute -right-2 top-10 flex size-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-lg rotate-12">
                    <Star className="size-6" />
                  </div>
                  <div className="relative z-10 flex w-full justify-center">
                    <Image
                      src="/pett.png"
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
                    <p className="mt-2 font-display text-4xl font-black tracking-tight text-primary">
                      3 books
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] bg-surface-container-highest p-5">
                    <div className="flex items-end justify-between gap-4">
                      <p className="text-sm font-bold text-on-surface-variant">Next Level Progress</p>
                      <p className="whitespace-nowrap font-display text-sm font-black text-primary">10 / 12</p>
                    </div>
                    <div className="mt-4 h-4 overflow-hidden rounded-full bg-surface">
                      <div className="h-full w-[83%] rounded-full bg-[linear-gradient(90deg,#006f7b,#58e7fb)]" />
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] bg-primary-container/30 p-5 text-on-primary-container">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em]">
                      <BookOpen className="size-4 text-primary" />
                      Reading streak
                    </div>
                    <p className="mt-2 text-base leading-7">
                      14 days in a row. Keep Mochi company and the next reward unlocks soon!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
