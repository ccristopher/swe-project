'use client';

import { useUser } from '@clerk/nextjs';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { DashboardStatCard } from './dashboard-stat-card';
import { createPlaceholderDashboardData, type DashboardData } from './home-content.data';
import { FinishedBookCard } from './finished-book-card';
import styles from './home-page-content.module.css';

const panelCardClassName =
  'gap-0 rounded-[2.125rem] border-0 bg-surface-container-low shadow-[0_14px_30px_var(--card-shadow)]';
const friendAvatarToneClassNames = [
  'bg-primary-container text-on-primary-fixed-variant',
  'bg-secondary-container text-on-secondary-container',
  'bg-tertiary-container text-on-tertiary-container',
] as const;

export function ReadingDashboard() {
  const { user } = useUser();
  const displayName = user?.firstName ?? user?.username ?? user?.fullName ?? 'Reader';
  const dashboard = createPlaceholderDashboardData(displayName);

  return (
    <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <DashboardHeroPanel greeting={dashboard.greeting} />
            <CurrentReadPanel currentRead={dashboard.currentRead} />

            <section className="grid gap-4 sm:grid-cols-3">
              {dashboard.stats.map((stat) => (
                <DashboardStatCard key={stat.label} {...stat} />
              ))}
            </section>

            <RecentlyReadPanel finishedBooks={dashboard.finishedBooks} />
            <MonthlyGoalPanel monthlyGoal={dashboard.monthlyGoal} />
          </div>

          <aside className="space-y-4">
            <PetSummaryPanel pet={dashboard.pet} />
            <NextUnlockPanel nextUnlock={dashboard.nextUnlock} />
            <RecentActivityPanel friendsActivity={dashboard.friendsActivity} />
          </aside>
        </div>
      </div>
    </section>
  );
}

function DashboardHeroPanel({ greeting }: { greeting: DashboardData['greeting'] }) {
  return (
    <Card className={`${panelCardClassName} p-6 sm:p-7`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="max-w-2xl lg:flex-1">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {greeting.title}
          </h1>
          <p className="mt-2 text-base leading-7 text-on-surface-variant">
            {greeting.body}
          </p>
        </div>

        <div className="flex shrink-0 items-center">
          <Button
            className={`h-14 cursor-pointer rounded-full px-8 font-display text-lg font-bold text-accent-foreground ${styles.primaryAction}`}
            type="button"
          >
            {greeting.cta}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function CurrentReadPanel({ currentRead }: { currentRead: DashboardData['currentRead'] }) {
  return (
    <Card className={`${panelCardClassName} p-5 sm:p-6`}>
      <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
        <div
          className={`relative mx-auto aspect-[2/3] w-full max-w-[11.25rem] overflow-hidden rounded-[1.95rem] lg:mx-0 ${styles.dashboardBookCover}`}
        >
          <Image
            src={currentRead.coverSrc}
            alt={currentRead.coverAlt}
            fill
            sizes="(max-width: 1024px) 180px, 180px"
            className="object-contain object-center"
          />
        </div>

        <Card className={`gap-0 rounded-[1.9rem] border-0 bg-surface-container p-5 shadow-none sm:p-6 ${styles.readingDetailsCard}`}>
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
              {currentRead.title}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">{currentRead.author}</p>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm font-semibold text-on-surface-variant">
              <span>Progress</span>
              <span>{currentRead.progressLabel}</span>
            </div>

            <Progress
              aria-label={`${currentRead.title} progress`}
              className="mt-2 h-4 rounded-full bg-surface-container-low"
              indicatorClassName="rounded-full bg-primary"
              value={currentRead.progress}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {currentRead.metrics.map((metric) => (
              <Card
                key={metric.label}
                className="gap-0 rounded-[1.65rem] border-0 bg-surface-container-low p-4 shadow-none"
              >
                <p className="text-sm font-medium text-on-surface-variant">{metric.label}</p>
                <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
                  {metric.value}
                </p>
              </Card>
            ))}
          </div>

          <Button
            className={`mt-5 h-11 w-full cursor-pointer rounded-full border-transparent bg-surface-container-low px-6 font-display text-base font-bold text-foreground ${styles.secondaryAction} ${styles.readingContinueButton}`}
            type="button"
            variant="outline"
          >
            Keep reading {currentRead.title}
            <ChevronRight className="size-4" />
          </Button>
        </Card>
      </div>
    </Card>
  );
}

function RecentlyReadPanel({ finishedBooks }: { finishedBooks: DashboardData['finishedBooks'] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Recently read
          </h2>
        </div>

        <button
          className="cursor-pointer text-sm font-semibold text-primary-dim transition-[opacity,color] hover:text-on-primary-container hover:opacity-80"
          type="button"
        >
          View all
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {finishedBooks.map((book) => (
          <FinishedBookCard key={book.title} {...book} />
        ))}
      </div>
    </section>
  );
}

function MonthlyGoalPanel({ monthlyGoal }: { monthlyGoal: DashboardData['monthlyGoal'] }) {
  return (
    <Card className={`${panelCardClassName} p-5 sm:p-6`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Monthly goal
          </h2>
          <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
            {monthlyGoal.currentPages} of {monthlyGoal.targetPages} pages
          </p>
        </div>

        <p className="text-sm font-semibold text-on-surface-variant sm:text-right">
          {monthlyGoal.progressLabel}
        </p>
      </div>

      <Progress
        aria-label="Monthly reading goal progress"
        className="mt-3 h-4 rounded-full bg-surface-container"
        indicatorClassName="rounded-full bg-primary"
        value={monthlyGoal.progress}
      />

      <p className="mt-3 text-sm leading-6 text-on-surface-variant">{monthlyGoal.body}</p>
    </Card>
  );
}

function PetSummaryPanel({ pet }: { pet: DashboardData['pet'] }) {
  return (
    <Card className={`${panelCardClassName} overflow-hidden p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
            Your Pet
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            {pet.name}
          </h2>
        </div>

        <Badge className="rounded-full bg-accent px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-accent-foreground hover:bg-accent">
          {pet.level}
        </Badge>
      </div>

      <Card
        className={`relative mt-4 min-h-[18rem] gap-0 rounded-[2.25rem] border-0 px-5 pb-5 pt-6 shadow-none ${styles.dashboardPetStage}`}
      >
        <div
          className="absolute -right-2 top-9 flex size-14 rotate-12 items-center justify-center rounded-full bg-tertiary text-foreground shadow-lg"
        >
          <span aria-hidden="true" className="text-[2.2rem] leading-none">
            {pet.icon}
          </span>
        </div>

        <div className="relative z-10 flex w-full justify-center">
          <Image
            src={pet.imageSrc}
            alt={pet.imageAlt}
            width={250}
            height={270}
            className="mx-auto mt-3 h-auto w-full max-w-56 object-contain object-center"
          />
        </div>
      </Card>

      <p className="mt-4 text-sm leading-6 text-on-surface-variant">{pet.remainingXp}</p>

      <Progress
        aria-label="Pet experience progress"
        className="mt-3 h-4 rounded-full bg-surface-container"
        indicatorClassName="rounded-full bg-primary"
        value={pet.progress}
      />

      <Card className="mt-1 gap-0 rounded-[1.65rem] border-0 bg-surface-container-low px-3 py-2.5 shadow-none">
        <div className="flex items-start gap-2">
          <span aria-hidden="true" className={styles.quoteMark}>
            &quot;
          </span>

          <blockquote className="pt-0.5 text-sm leading-6 text-foreground">
            {pet.quote}
          </blockquote>
        </div>
      </Card>
    </Card>
  );
}

function NextUnlockPanel({ nextUnlock }: { nextUnlock: DashboardData['nextUnlock'] }) {
  return (
    <Card className={`${panelCardClassName} p-5`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
        Next unlock
      </p>
      <h3 className="mt-2 font-display text-[1.85rem] font-extrabold tracking-tight text-foreground">
        {nextUnlock.title}
      </h3>

      <p className="mt-1 text-sm font-semibold text-on-primary-fixed-variant">{nextUnlock.genre}</p>

      <p className="mt-3 text-base font-semibold text-foreground">{nextUnlock.remaining}</p>

      <Progress
        aria-label="Next unlock progress"
        className="mt-3 h-4 rounded-full bg-surface-container"
        indicatorClassName="rounded-full bg-tertiary"
        value={nextUnlock.progress}
      />

      <Separator className="mt-4 bg-border/70" />

      <div className="pt-4">
        <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          Equipped accessories
        </h3>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {nextUnlock.accessorySlots.map((slot) => (
            <Card
              key={slot}
              className={`aspect-square gap-0 rounded-[1.5rem] border-0 p-0 shadow-none ${styles.wardrobeSlot}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

function RecentActivityPanel({
  friendsActivity,
}: {
  friendsActivity: DashboardData['friendsActivity'];
}) {
  return (
    <Card className={`${panelCardClassName} p-5`}>
      <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
        Recent activity
      </h3>

      <div className="mt-3 space-y-2.5">
        {friendsActivity.map((activity, index) => (
          <Card
            key={`${activity.name}-${activity.time}`}
            className="gap-0 rounded-[1.55rem] border-0 bg-surface-container-low p-2.5 shadow-[inset_0_0_0_1px_var(--border)]"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${friendAvatarToneClassNames[index % friendAvatarToneClassNames.length]}`}
              >
                {activity.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm leading-6 text-foreground">
                  <span className="font-semibold">{activity.name}</span> {activity.action}
                </p>
                <p className="text-xs font-medium text-on-surface-variant">{activity.time}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
