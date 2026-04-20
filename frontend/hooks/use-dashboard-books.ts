import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import type { CurrentRead, FinishedBook } from '@/components/home/home-content.data';
import { sumPagesFromBooks } from '@/lib/readingProgress';
import { cleanEquippedItems, emptyEquippedItems, type EquippedItems } from '@/lib/petItems';

type ApiBook = {
  _id?: string;
  author?: string;
  completed?: boolean;
  coverUrl?: string;
  name?: string;
  numberOfPages?: number;
  pagesRead?: number;
  review?: string;
};

type LeaderboardUser = {
  clerkUserId?: string;
  booksCompleted?: number;
};

type DashboardBookUpdate = {
  _id: string;
  author?: string;
  completed?: boolean;
  coverUrl?: string;
  name?: string;
  numberOfPages?: number;
  pagesRead?: number;
  review?: string;
};

export type UseDashboardBookUpdate = DashboardBookUpdate;

export type UseDashboardBooksResult = {
  completedBooks: number;
  currentRead: CurrentRead | null;
  displayName: string;
  leaderboardRank: number | null;
  monthlyGoalTargetPages: number;
  recentBooks: FinishedBook[];
  isDashboardLoading: boolean;
  petEquippedItems: EquippedItems;
  petImageSrc: string;
  totalBooks: number;
  totalPagesRead: number;
  unlockedRewards: string[];
  addUnlockedRewards: (ids: string[]) => void;
  updateBookInDashboard: (updatedBook: UseDashboardBookUpdate) => void;
};

const defaultCoverSrc = '/defbookcover-min.jpg';

function toCoverSrc(coverUrl: unknown) {
  if (typeof coverUrl !== 'string' || !coverUrl.trim()) return defaultCoverSrc;
  if (/^https?:\/\//i.test(coverUrl)) return coverUrl;
  return coverUrl.startsWith('/') ? coverUrl : `/${coverUrl}`;
}

function toProgress(book: ApiBook) {
  const totalPages = Number(book.numberOfPages);
  const safeTotalPages = Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 0;

  const pagesRead = Number(book.pagesRead);
  const safePagesRead = Number.isFinite(pagesRead) && pagesRead >= 0 ? pagesRead : 0;

  if (safeTotalPages <= 0) {
    return {
      pagesRead: safePagesRead,
      progress: 0,
      totalPages: safeTotalPages,
    };
  }

  const normalizedPagesRead = Math.min(safePagesRead, safeTotalPages);
  const progress = Math.round((normalizedPagesRead / safeTotalPages) * 100);

  return {
    pagesRead: normalizedPagesRead,
    progress,
    totalPages: safeTotalPages,
  };
}

function getCurrentRead(books: ApiBook[]): CurrentRead | null {
  if (!books.length) return null;
  const currentBook =
    books.find((book) => book.completed === false) ??
    books.find((book) => !book.completed) ??
    books[0];

  if (!currentBook) return null;

  const title = currentBook.name?.trim() || 'Untitled book';
  const author = currentBook.author?.trim() || 'Unknown author';
  const coverUrl = toCoverSrc(currentBook.coverUrl);
  const numberOfPages = Number.isFinite(Number(currentBook.numberOfPages))
    ? Math.max(0, Math.floor(Number(currentBook.numberOfPages)))
    : 0;
  const { pagesRead, progress, totalPages } = toProgress(currentBook);

  return {
    _id: typeof currentBook._id === 'string' ? currentBook._id : '',
    author,
    completed: Boolean(currentBook.completed),
    coverAlt: `${title} book cover`,
    coverUrl,
    coverSrc: coverUrl,
    metrics: [
      { label: 'Pages read', value: `${pagesRead}` },
      { label: 'Total pages', value: totalPages > 0 ? `${totalPages}` : '-' },
    ],
    name: title,
    numberOfPages,
    pagesRead,
    progress,
    progressLabel: `${progress}%`,
    review: typeof currentBook.review === 'string' ? currentBook.review : '',
    title,
  };
}

function getRecentBooks(books: ApiBook[]): FinishedBook[] {
  const recentBooks = books.slice(0, 4);
  if (!recentBooks.length) return [];

  return recentBooks.map((book) => ({
    _id: typeof book._id === 'string' ? book._id : '',
    author: book.author?.trim() || 'Unknown author',
    completed: Boolean(book.completed),
    coverUrl: toCoverSrc(book.coverUrl),
    imageSrc: toCoverSrc(book.coverUrl),
    name: book.name?.trim() || 'Untitled book',
    numberOfPages: Number.isFinite(Number(book.numberOfPages))
      ? Math.max(0, Math.floor(Number(book.numberOfPages)))
      : 0,
    pagesRead: Number.isFinite(Number(book.pagesRead)) ? Math.max(0, Math.floor(Number(book.pagesRead))) : 0,
    review: typeof book.review === 'string' ? book.review : '',
    title: book.name?.trim() || 'Untitled book',
  }));
}

function toLeaderboardRank(currentUserId: string, leaderboard: LeaderboardUser[]) {
  const currentUserIndex = leaderboard.findIndex((entry) => entry.clerkUserId === currentUserId);
  return currentUserIndex >= 0 ? currentUserIndex + 1 : null;
}

export function useDashboardBooks(): UseDashboardBooksResult {
  const { isLoaded, user } = useUser();
  const [books, setBooks] = useState<ApiBook[] | null>(null);
  const [petImageSrc, setPetImageSrc] = useState<string | null>(null);
  const [petEquippedItems, setPetEquippedItems] = useState<EquippedItems>(emptyEquippedItems());
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
  const [monthlyGoalTargetPages, setMonthlyGoalTargetPages] = useState<number | null>(null);
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);

  function addUnlockedRewards(ids: string[]) {
    if (!ids.length) return;
    setUnlockedRewards((prev) => Array.from(new Set([...prev, ...ids])));
  }

  function updateBookInDashboard(updatedBook: DashboardBookUpdate) {
    setBooks((previousBooks) => {
      if (!previousBooks) return previousBooks;

      return previousBooks.map((book) =>
        book._id === updatedBook._id
          ? {
              ...book,
              ...updatedBook,
            }
          : book,
      );
    });
  }

  const displayName = user?.firstName ?? user?.username ?? user?.fullName ?? 'Reader';
  const isDashboardLoading =
    !isLoaded || (Boolean(user?.id) && (books === null || petImageSrc === null || monthlyGoalTargetPages === null));

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      if (!isLoaded) return;

      if (!user?.id) {
        if (isMounted) {
          setBooks([]);
          setPetImageSrc('/gator....png');
          setPetEquippedItems(emptyEquippedItems());
          setLeaderboardRank(null);
          setMonthlyGoalTargetPages(500);
          setUnlockedRewards([]);
        }
        return;
      }

      if (isMounted) {
        setBooks(null);
        setPetImageSrc(null);
        setPetEquippedItems(emptyEquippedItems());
        setLeaderboardRank(null);
        setMonthlyGoalTargetPages(null);
        setUnlockedRewards([]);
      }

      try {
        const [booksResponse, profileResponse, leaderboardResponse] = await Promise.all([
          fetch('/api/books'),
          fetch(`/api/users/profile?userId=${user.id}`),
          fetch('/api/leaderboard'),
        ]);

        if (!booksResponse.ok) {
          if (isMounted) {
            setBooks([]);
          }
        } else {
          const data = await booksResponse.json();
          const nextBooks: ApiBook[] = Array.isArray(data?.books) ? data.books : [];

          if (isMounted) {
            setBooks(nextBooks);
          }
        }

        if (!profileResponse.ok) {
          if (isMounted) {
            setPetImageSrc('/gator....png');
            setPetEquippedItems(emptyEquippedItems());
            setLeaderboardRank(null);
            setMonthlyGoalTargetPages(500);
            setUnlockedRewards([]);
          }
        } else {
          const profileData = await profileResponse.json();
          const petImage =
            typeof profileData?.pet?.imageID === 'string' && profileData.pet.imageID.trim()
              ? profileData.pet.imageID
              : '/gator....png';

          const rawRewards = profileData?.user?.unlockedRewards;
          const rewardsList = Array.isArray(rawRewards)
            ? rawRewards.filter((x: unknown) => typeof x === 'string')
            : [];
          const savedMonthlyGoal = Number(profileData?.user?.monthlyGoalTargetPages);
          const nextMonthlyGoalTargetPages =
            Number.isFinite(savedMonthlyGoal) && Math.floor(savedMonthlyGoal) > 0
              ? Math.floor(savedMonthlyGoal)
              : 500;

          let nextRank: number | null = null;

          if (leaderboardResponse.ok) {
            const leaderboardData = await leaderboardResponse.json();
            const leaderboard: LeaderboardUser[] = Array.isArray(leaderboardData?.leaderboard)
              ? leaderboardData.leaderboard
              : [];
            nextRank = toLeaderboardRank(user.id, leaderboard);
          }

          if (isMounted) {
            setPetImageSrc(petImage);
            setPetEquippedItems(cleanEquippedItems(profileData?.pet?.equippedItems));
            setLeaderboardRank(nextRank);
            setMonthlyGoalTargetPages(nextMonthlyGoalTargetPages);
            setUnlockedRewards(rewardsList);
          }
        }
      } catch {
        if (isMounted) {
          setBooks([]);
          setPetImageSrc('/gator....png');
          setPetEquippedItems(emptyEquippedItems());
          setLeaderboardRank(null);
          setMonthlyGoalTargetPages(500);
          setUnlockedRewards([]);
        }
      }
    }

    void loadBooks();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, user?.id]);

  const currentRead = useMemo(() => (books ? getCurrentRead(books) : null), [books]);
  const recentBooks = useMemo(() => (books ? getRecentBooks(books) : []), [books]);
  const allBooks = books ?? [];
  const totalBooks = allBooks.length;
  const completedBooks = allBooks.filter((book) => Boolean(book.completed)).length;
  const totalPagesRead = sumPagesFromBooks(allBooks);

  return {
    completedBooks,
    currentRead,
    displayName,
    leaderboardRank,
    monthlyGoalTargetPages: monthlyGoalTargetPages ?? 500,
    recentBooks,
    isDashboardLoading,
    petEquippedItems,
    petImageSrc: petImageSrc ?? '/gator....png',
    totalBooks,
    totalPagesRead,
    unlockedRewards,
    addUnlockedRewards,
    updateBookInDashboard,
  };
}


