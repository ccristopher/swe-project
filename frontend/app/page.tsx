'use client';

import { Show, SignInButton, SignUpButton } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl gap-12 px-6 pb-12 pt-4 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex h-90 w-full max-w-105 items-center justify-center rounded-4xl border-2 border-black bg-white p-8">
            <div className="text-center">
              <p className="mt-6 text-base text-muted-foreground">
                insert cute pet here
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl text-center">
            Build a reading habit that feels{' '}
            <span className="underline decoration-4 decoration-wavy underline-offset-9 decoration-[#c95b4a]">fun!</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Log books, earn pets and accessories, and make reading feel rewarding instead of
            lonely or hard to keep up with.
          </p>

          <div className="mt-10 flex w-full max-w-xl flex-col gap-5">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="h-16 rounded-full border-2 border-black px-8 text-2xl transition hover:-translate-y-0.5 hover:bg-[#ffe680] hover:shadow-[0_6px_0_#000000] active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  Get started
                  <ArrowRight className="size-5" />
                </Button>
              </SignUpButton>

              <SignInButton mode="modal">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 rounded-full border-2 border-black bg-white px-8 text-2xl transition hover:-translate-y-0.5 hover:bg-[#f7f7f7] hover:shadow-[0_6px_0_#000000] active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  I already have an account
                </Button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <Button
                  size="lg"
                  className="h-16 rounded-full border-2 border-black px-8 text-2xl transition hover:-translate-y-0.5 hover:bg-[#ffe680] hover:shadow-[0_6px_0_#000000] active:translate-y-0 active:shadow-none cursor-pointer"
              >
                You&apos;re signed in :)
              </Button>
            </Show>
          </div>
        </div>
      </div>
    </section>
  );
}
