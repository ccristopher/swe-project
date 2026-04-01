import { BarChart3, BookOpen, Flame, type LucideIcon } from 'lucide-react';

export type DashboardStatTone = 'book' | 'pages' | 'streak';

export type DashboardStat = {
  icon: LucideIcon;
  label: string;
  tone: DashboardStatTone;
  value: string;
};

export type FinishedBook = {
  author: string;
  imageSrc: string;
  title: string;
};

export type FriendActivity = {
  action: string;
  initials: string;
  name: string;
  time: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
};

export type DashboardGreeting = {
  body: string;
  cta: string;
  title: string;
};

export type CurrentRead = {
  author: string;
  coverAlt: string;
  coverSrc: string;
  metrics: DashboardMetric[];
  progress: number;
  progressLabel: string;
  title: string;
};

export type MonthlyGoal = {
  body: string;
  currentPages: number;
  progress: number;
  progressLabel: string;
  targetPages: number;
};

export type DashboardPet = {
  icon: string;
  imageAlt: string;
  imageSrc: string;
  level: string;
  name: string;
  quote: string;
  remainingXp: string;
  progress: number;
};

export type NextUnlock = {
  accessorySlots: string[];
  genre: string;
  progress: number;
  remaining: string;
  title: string;
};

export type DashboardData = {
  currentRead: CurrentRead;
  finishedBooks: FinishedBook[];
  friendsActivity: FriendActivity[];
  greeting: DashboardGreeting;
  monthlyGoal: MonthlyGoal;
  nextUnlock: NextUnlock;
  pet: DashboardPet;
  stats: DashboardStat[];
};

export const landingHeroCopy = {
  description: 'Log books, unlock pets and accessories, and make reading feel rewarding.',
  headlineEmphasis: 'fun',
  headlinePrefix: 'Build a reading habit that feels',
  headlineSuffix: ', social, and easy to keep!',
};

export const landingPetPreview = {
  imageAlt: 'Pet companion illustration',
  imageSrc: '/placeholder_pet.png',
  level: 'Level 24',
  name: 'Mochi',
  progress: 83,
  progressLabel: 'Next Lvl Progress',
  progressValue: '10 / 12',
  streakCopy: '14-day streak. Keep reading to unlock your next reward!',
  weeklyBooks: '3 books',
};

// replace this object with real dashboard data from the backend
export const placeholderDashboardData: DashboardData = {
  currentRead: {
    author: 'J.R.R. Tolkien',
    coverAlt: 'The Hobbit book cover',
    coverSrc: '/hobbit.jpg',
    metrics: [
      { label: 'Pages today', value: '32' },
      { label: 'Today’s goal', value: '50' },
    ],
    progress: 46,
    progressLabel: '46%',
    title: 'The Hobbit',
  },
  finishedBooks: [
    {
      author: 'Sally Rooney',
      imageSrc: '/normal.jpg',
      title: 'Normal People',
    },
    {
      author: 'Madeline Miller',
      imageSrc: '/circe.jpg',
      title: 'Circe',
    },
    {
      author: 'Matt Haig',
      imageSrc: '/midnight.jpg',
      title: 'The Midnight Library',
    },
    {
      author: 'Andy Weir',
      imageSrc: '/hail.jpg',
      title: 'Project Hail Mary',
    },
  ],
  friendsActivity: [
    {
      action: 'finished The Housemaid',
      initials: 'RA',
      name: 'Rawan',
      time: '12 min ago',
    },
    {
      action: 'started The Little Prince',
      initials: 'JO',
      name: 'Jordan',
      time: '1 hr ago',
    },
    {
      action: 'unlocked a new accessory',
      initials: 'AV',
      name: 'Avi',
      time: '3 hr ago',
    },
  ],
  greeting: {
    body: "You've read 4 days this week. One more session keeps your streak and helps Mochi level up.",
    cta: 'Start reading',
    title: 'Welcome back, Reader!',
  },
  monthlyGoal: {
    body: "You're ahead this month. Read 40 more pages today to stay ahead.",
    currentPages: 312,
    progress: 62.4,
    progressLabel: '62%',
    targetPages: 500,
  },
  nextUnlock: {
    accessorySlots: ['slot-1', 'slot-2', 'slot-3'],
    genre: 'Fantasy reward',
    progress: 50,
    remaining: '20 more pages to unlock',
    title: 'Reading Glasses',
  },
  pet: {
    icon: '🐬',
    imageAlt: 'Mochi the reading companion',
    imageSrc: '/placeholder_pet.png',
    level: 'Level 26',
    name: 'Mochi',
    quote: '“So we beat on, boats against the current, borne back ceaselessly into the past.”',
    remainingXp: '16 XP to Level 27',
    progress: 84,
  },
  stats: [
    {
      icon: BookOpen,
      label: 'Books finished',
      tone: 'book',
      value: '52',
    },
    {
      icon: BarChart3,
      label: 'Pages read this month',
      tone: 'pages',
      value: '2,400',
    },
    {
      icon: Flame,
      label: 'Streak',
      tone: 'streak',
      value: '14 days',
    },
  ],
};

export function createPlaceholderDashboardData(displayName: string) {
  const name = displayName.trim() || 'Reader';

  return {
    ...placeholderDashboardData,
    greeting: {
      ...placeholderDashboardData.greeting,
      title: `Welcome back, ${name}!`,
    },
  };
}
