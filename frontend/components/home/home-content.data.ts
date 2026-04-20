import type { LucideIcon } from 'lucide-react';

export type DashboardStatTone = 'book' | 'pages' | 'rank';

export type DashboardStat = {
  icon: LucideIcon;
  label: string;
  tone: DashboardStatTone;
  value: string;
};

export type FinishedBook = {
  _id: string;
  author: string;
  completed: boolean;
  coverUrl: string;
  dnf?: boolean;
  imageSrc: string;
  name: string;
  numberOfPages: number;
  pagesRead: number;
  review?: string;
  title: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
};

export type CurrentRead = {
  _id: string;
  author: string;
  completed: boolean;
  coverAlt: string;
  coverUrl: string;
  coverSrc: string;
  dnf?: boolean;
  metrics: DashboardMetric[];
  name: string;
  numberOfPages: number;
  pagesRead: number;
  progress: number;
  progressLabel: string;
  review?: string;
  title: string;
};

export type MonthlyGoal = {
  body: string;
  currentPages: number;
  progress: number;
  progressLabel: string;
  targetPages: number;
};

export const landingHeroCopy = {
  description: 'Log books, unlock pets and accessories, and make reading feel rewarding.',
  headlineEmphasis: 'fun',
  headlinePrefix: 'Build a reading habit that feels',
  headlineSuffix: ', social, and easy to keep!',
};

export const landingPetPreview = {
  imageAlt: 'Pet companion illustration',
  imageSrc: '/gator....png',
  level: 'Level 24',
  name: 'Mochi',
  progress: 83,
  progressLabel: 'Next Lvl Progress',
  progressValue: '10 / 12',
  streakCopy: '14-day streak. Keep reading to unlock your next reward!',
  weeklyBooks: '3 books',
};


