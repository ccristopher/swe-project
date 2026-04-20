'use client';

import { useState } from 'react';
import { BarChart3, BookOpen, ChevronRight, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useDashboardBooks } from '@/hooks/use-dashboard-books';
import { getLevelFromTotalPages, READING_PAGES_PER_LEVEL } from '@/lib/readingProgress';
import { rewardLabelForLevel } from '@/lib/levelRewards';
import { getPetItem, petItemSlots, type EquippedItems } from '@/lib/petItems';
import { BookDetailsModal } from '@/components/books/book-details-modal';
import { PetAvatar } from '@/components/pet-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { DashboardStatCard } from './dashboard-stat-card';
import type { CurrentRead, DashboardStat, FinishedBook, MonthlyGoal } from './home-content.data';
import { FinishedBookCard } from './finished-book-card';
import styles from './home-page-content.module.css';

const panelCardClassName =
  'gap-0 rounded-[2.125rem] border-0 bg-surface-container-low shadow-[0_14px_30px_var(--card-shadow)]';

export function ReadingDashboard() {
  const {
    completedBooks,
    currentRead,
    displayName,
    isDashboardLoading,
    leaderboardRank,
    monthlyGoalTargetPages,
    unlockedRewards,
    addUnlockedRewards,
    petEquippedItems,
    petImageSrc,
    recentBooks,
    totalBooks,
    totalPagesRead,
    updateBookInDashboard,
  } = useDashboardBooks();
  const [selectedBook, setSelectedBook] = useState<FinishedBook | null>(null);

  const greeting = {
    body: 'Track your reading progress and keep your momentum going.',
    cta: 'Start reading',
    title: `Welcome back, ${displayName}!`,
  };

  const stats: DashboardStat[] = [
    { icon: BookOpen, label: 'Books logged', tone: 'book', value: `${totalBooks}` },
    { icon: BarChart3, label: 'Pages read', tone: 'pages', value: `${totalPagesRead}` },
    { icon: Trophy, label: 'Ranking', tone: 'rank', value: leaderboardRank ? `#${leaderboardRank}` : '-' },
  ];

  const monthlyGoal: MonthlyGoal = {
    body: completedBooks
      ? 'Nice progress. Keep reading to finish even more this month.'
      : 'Start your first book this month and build your reading habit.',
    currentPages: totalPagesRead,
    progress: Math.min(100, (totalPagesRead / monthlyGoalTargetPages) * 100),
    progressLabel: `${Math.min(100, Math.round((totalPagesRead / monthlyGoalTargetPages) * 100))}%`,
    targetPages: monthlyGoalTargetPages,
  };

  if (isDashboardLoading) {
    return (
      <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center">
          <p className="text-base font-medium text-on-surface-variant">Loading dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <DashboardHeroPanel greeting={greeting} />
            <CurrentReadPanel
              currentRead={currentRead}
              onOpenDetails={() => {
                if (!currentRead) return;

                setSelectedBook({
                  _id: currentRead._id,
                  author: currentRead.author,
                  completed: currentRead.completed,
                  coverUrl: currentRead.coverUrl,
                  imageSrc: currentRead.coverSrc,
                  name: currentRead.name,
                  numberOfPages: currentRead.numberOfPages,
                  pagesRead: currentRead.pagesRead,
                  review: currentRead.review || '',
                  title: currentRead.title,
                });
              }}
              onKeepReading={async () => {
                if (!currentRead) return;

                const pages = prompt("Update pages read:", `${currentRead.pagesRead || 0}`);
                if (!pages) return;

                const pagesNum = Number(pages);
                if (!Number.isFinite(pagesNum) || pagesNum < 0) {
                  alert("Please enter a valid non-negative number");
                  return;
                }

                const response = await fetch(`/api/books/${currentRead._id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ pagesRead: Math.floor(pagesNum) }),
                });

                if (!response.ok) {
                  const data = await response.json().catch(() => ({}));
                  alert(data?.error || "Could not update progress");
                  return;
                }

                const data = await response.json().catch(() => ({}));
                const newLevelRewards = Array.isArray(data?.newLevelRewards)
                  ? data.newLevelRewards.filter((x: unknown) => typeof x === "string")
                  : [];
                if (newLevelRewards.length) addUnlockedRewards(newLevelRewards);

                updateBookInDashboard({
                  _id: currentRead._id,
                  pagesRead: Math.floor(pagesNum),
                });
              }}
            />

            <section className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <DashboardStatCard key={stat.label} {...stat} />
              ))}
            </section>

            <RecentlyReadPanel recentBooks={recentBooks} onSelectBook={setSelectedBook} />
            <MonthlyGoalPanel monthlyGoal={monthlyGoal} />
          </div>

          <aside className="space-y-4">
            <PetSummaryPanel
              petEquippedItems={petEquippedItems}
              petImageSrc={petImageSrc}
              totalPagesRead={totalPagesRead}
            />
            <NextUnlockPanel
              petEquippedItems={petEquippedItems}
              totalPagesRead={totalPagesRead}
            />
          </aside>
        </div>
      </div>

      <BookDetailsModal
        book={selectedBook}
        onCloseAction={() => setSelectedBook(null)}
        onBookUpdatedAction={(updatedBook, meta) => {
          setSelectedBook(updatedBook);
          updateBookInDashboard(updatedBook);
          if (meta?.newLevelRewards?.length) addUnlockedRewards(meta.newLevelRewards);
        }}
      />
    </section>
  );
}

function DashboardHeroPanel({ greeting }: { greeting: { body: string; cta: string; title: string } }) {
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
            asChild
            className={`h-14 cursor-pointer rounded-full px-8 font-display text-lg font-bold text-accent-foreground ${styles.primaryAction}`}
          >
            <Link href="/books/log">
              {greeting.cta}
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function CurrentReadPanel({
  currentRead,
  onOpenDetails,
  onKeepReading,
}: {
  currentRead: CurrentRead | null;
  onOpenDetails: () => void;
  onKeepReading: () => void;
}) {
  if (!currentRead) {
    return (
      <Card className={`${panelCardClassName} p-6`}>
        <p className="text-sm font-medium text-on-surface-variant">No books yet. Start by logging your first read.</p>
        <Button asChild className={`mt-4 h-11 w-fit rounded-full px-6 font-display text-base font-bold ${styles.primaryAction}`}>
          <Link href="/books/log">Add a book</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className={`${panelCardClassName} p-5 sm:p-6`}>
      <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
        <div
          className={`relative mx-auto aspect-2/3 w-full max-w-45 cursor-pointer overflow-hidden rounded-[1.95rem] lg:mx-0 ${styles.dashboardBookCover}`}
          onClick={onOpenDetails}
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
            onClick={onKeepReading}
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

function RecentlyReadPanel({
  recentBooks,
  onSelectBook,
}: {
  recentBooks: FinishedBook[];
  onSelectBook: (book: FinishedBook) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Recently read
          </h2>
        </div>

        <Link
          href="/books"
          className="cursor-pointer text-sm font-semibold text-primary-dim transition-[opacity,color] hover:text-on-primary-container hover:opacity-80"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {recentBooks.length ? (
          recentBooks.map((book) => (
            <FinishedBookCard key={book._id || book.title} {...book} onClick={() => onSelectBook(book)} />
          ))
        ) : (
          <p className="text-sm font-medium text-on-surface-variant">No books logged yet.</p>
        )}
      </div>
    </section>
  );
}

function MonthlyGoalPanel({ monthlyGoal }: { monthlyGoal: MonthlyGoal }) {
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

function PetSummaryPanel({
  petEquippedItems,
  petImageSrc,
  totalPagesRead,
}: {
  petEquippedItems: EquippedItems;
  petImageSrc: string;
  totalPagesRead: number;
}) {
  const {
    level,
    pagesToNextLevel,
    levelProgressPercent: levelProgress,
  } = getLevelFromTotalPages(totalPagesRead, READING_PAGES_PER_LEVEL);

  return (
    <Card className={`${panelCardClassName} overflow-hidden p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">Your Pet</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Companion</h2>
        </div>

        <Badge className="rounded-full bg-accent px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-accent-foreground hover:bg-accent">
          Level {level}
        </Badge>
      </div>

      <Card className={`relative mt-4 min-h-72 gap-0 rounded-[2.25rem] border-0 px-5 pb-5 pt-6 shadow-none ${styles.dashboardPetStage}`}>
        <div className="relative z-10 flex w-full justify-center">
          <PetAvatar
            imageSrc={petImageSrc}
            equippedItems={petEquippedItems}
            alt="Reading companion"
            className="mx-auto mt-3 h-48 w-48"
          />
        </div>
      </Card>

      <p className="mt-4 text-sm leading-6 text-on-surface-variant">
        {pagesToNextLevel} pages to Level {level + 1}
      </p>

      <Progress
        aria-label="Pet experience progress"
        className="mt-3 h-4 rounded-full bg-surface-container"
        indicatorClassName="rounded-full bg-primary"
        value={levelProgress}
      />
    </Card>
  );
}

function NextUnlockPanel({
  petEquippedItems,
  totalPagesRead,
}: {
  petEquippedItems: EquippedItems;
  totalPagesRead: number;
}) {
  const { level, pagesToNextLevel, levelProgressPercent } = getLevelFromTotalPages(
    totalPagesRead,
    READING_PAGES_PER_LEVEL
  );
  const nextLevel = level + 1;
  const nextRewardName = rewardLabelForLevel(nextLevel);

  return (
    <Card className={`${panelCardClassName} p-5`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
        Next level reward
      </p>
      <h3 className="mt-2 font-display text-[1.85rem] font-extrabold tracking-tight text-foreground">
        {nextRewardName || "Keep reading!"}
      </h3>

      <p className="mt-1 text-sm font-semibold text-on-primary-fixed-variant">
        Reach level {nextLevel}
      </p>
      <p className="mt-3 text-base font-semibold text-foreground">
        {pagesToNextLevel} more pages to level up
      </p>

      <Progress
        aria-label="Progress toward next level reward"
        className="mt-3 h-4 rounded-full bg-surface-container"
        indicatorClassName="rounded-full bg-tertiary"
        value={levelProgressPercent}
      />

      <Separator className="mt-4 bg-border/70" />

      <div className="pt-4">
        <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          Currently wearing
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          Accessories your pet has equipped.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {petItemSlots.map((slot) => {
            const item = getPetItem(petEquippedItems[slot]);
            return (
              <Card
                key={slot}
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl border-0 p-2 text-center shadow-none ${styles.wardrobeSlot}`}
              >
                {item ? (
                  <>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="image-pixel h-10 w-10 object-contain"
                    />
                    <span className="text-xs font-semibold leading-tight text-foreground">
                      {item.name}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-on-surface-variant">None</span>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
