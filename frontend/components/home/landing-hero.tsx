'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { ArrowRight, BookOpen, Star } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { landingHeroCopy, landingPetPreview } from './home-content.data';
import styles from './home-page-content.module.css';

export function LandingHero() {
  return (
    <section className="px-6 pb-16 pt-6 sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
            {landingHeroCopy.headlinePrefix}{' '}
            <span className="text-primary">{landingHeroCopy.headlineEmphasis}</span>
            {landingHeroCopy.headlineSuffix}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-on-surface-variant">
            {landingHeroCopy.description}
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
  return (
    <div className="mt-10 flex w-full max-w-xl flex-col gap-4">
      <SignUpButton mode="modal">
        <Button
          className={`h-16 cursor-pointer rounded-full px-8 font-display text-xl font-bold text-accent-foreground ${styles.primaryAction}`}
          type="button"
        >
          Get started
          <ArrowRight className="size-5" />
        </Button>
      </SignUpButton>

      <SignInButton mode="modal">
        <Button
          className={`h-16 cursor-pointer rounded-full border-transparent bg-surface-container-low px-8 font-display text-xl font-bold text-foreground hover:bg-surface-container ${styles.secondaryAction}`}
          type="button"
          variant="outline"
        >
          I already have an account
        </Button>
      </SignInButton>
    </div>
  );
}

function PetPreviewCard() {
  return (
    <div className="relative w-full max-w-xl">
      <Card className="relative gap-0 overflow-hidden rounded-[2.5rem] border-0 bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              Your Pet
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
              {landingPetPreview.name}
            </h2>
          </div>

          <Badge className="rounded-full bg-accent px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-accent-foreground hover:bg-accent">
            {landingPetPreview.level}
          </Badge>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-center">
          <Card className={`relative min-h-90 gap-0 rounded-[2.25rem] border-0 px-6 py-8 shadow-none ${styles.petStage}`}>
            <div
              className="absolute -right-2 top-10 flex size-14 rotate-12 items-center justify-center rounded-full bg-tertiary text-foreground shadow-lg"
            >
              <Star className="size-6" />
            </div>

            <div className="relative z-10 flex w-full justify-center">
              <Image
                src={landingPetPreview.imageSrc}
                alt={landingPetPreview.imageAlt}
                width={280}
                height={330}
                className="h-auto w-full max-w-70 object-contain object-center"
                priority
              />
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="gap-0 rounded-[1.75rem] border-0 bg-surface-container-highest p-5 shadow-none">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">
                This week
              </p>
              <p className="mt-2 font-display text-4xl font-black tracking-tight text-foreground">
                {landingPetPreview.weeklyBooks}
              </p>
            </Card>

            <Card className="gap-0 rounded-[1.75rem] border-0 bg-surface-container-highest p-5 shadow-none">
              <div className="flex items-end justify-between gap-4">
                <p className="whitespace-nowrap text-sm font-bold text-on-surface-variant">
                  {landingPetPreview.progressLabel}
                </p>
                <p className="whitespace-nowrap font-display text-sm font-black text-foreground">
                  {landingPetPreview.progressValue}
                </p>
              </div>

              <Progress
                aria-label="Pet preview level progress"
                className="mt-4 h-4 rounded-full bg-surface"
                indicatorClassName="rounded-full bg-primary"
                value={landingPetPreview.progress}
              />
            </Card>

            <Card className="gap-0 rounded-[1.75rem] border-0 bg-tertiary-container/60 p-5 text-foreground shadow-none">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em]">
                <BookOpen className="size-4 text-tertiary" />
                Reading streak
              </div>

              <p className="mt-2 text-base leading-7 text-on-primary-container">
                {landingPetPreview.streakCopy}
              </p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
