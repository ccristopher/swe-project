/** Pages per pet level (must match level rewards in `levelRewards.ts`). */
export const READING_PAGES_PER_LEVEL = 150;

export type BookForPages = {
  dnf?: unknown;
  pagesRead?: unknown;
  completed?: unknown;
  numberOfPages?: unknown;
};

export function canMarkBookCompleted(book: Pick<BookForPages, 'numberOfPages' | 'pagesRead'>): boolean {
  const numberOfPages = Number(book.numberOfPages);
  const pagesRead = Number(book.pagesRead);

  if (!Number.isFinite(numberOfPages) || numberOfPages <= 0) return false;
  if (!Number.isFinite(pagesRead) || pagesRead < 0) return false;

  return pagesRead / numberOfPages >= 0.9;
}

export function shouldAutoCompleteBook(book: Pick<BookForPages, 'numberOfPages' | 'pagesRead'>): boolean {
  const numberOfPages = Number(book.numberOfPages);
  const pagesRead = Number(book.pagesRead);

  if (!Number.isFinite(numberOfPages) || numberOfPages <= 0) return false;
  if (!Number.isFinite(pagesRead) || pagesRead < 0) return false;

  return pagesRead >= numberOfPages;
}

export function getBookStatus(book: Pick<BookForPages, 'completed' | 'dnf'>): 'completed' | 'dnf' | 'in_progress' {
  if (Boolean(book.dnf)) return 'dnf';
  if (Boolean(book.completed)) return 'completed';
  return 'in_progress';
}

export function sumPagesFromBooks(books: BookForPages[]): number {
  return books.reduce((sum, book) => {
    const pagesRead = Number(book.pagesRead);
    const isComplete = Boolean(book.completed);
    const numberOfPages = Number(book.numberOfPages);

    if (isComplete && Number.isFinite(numberOfPages) && numberOfPages > 0) {
      return sum + numberOfPages;
    }

    if (Number.isFinite(pagesRead) && pagesRead >= 0) {
      return sum + pagesRead;
    }

    return sum;
  }, 0);
}

export function countCompletedBooks(books: BookForPages[]): number {
  return books.filter((b) => getBookStatus(b) === 'completed').length;
}

export function totalsFromBooks(books: BookForPages[]) {
  return {
    totalPagesRead: sumPagesFromBooks(books),
    booksCompleted: countCompletedBooks(books),
  };
}

/** Pet levels: every `pagesPerLevel` pages you go up one level (level 1 at 0 pages). */
export function getLevelFromTotalPages(
  totalPagesRead: number,
  pagesPerLevel = READING_PAGES_PER_LEVEL
): {
  level: number;
  pagesIntoLevel: number;
  pagesToNextLevel: number;
  levelProgressPercent: number;
} {
  const safeTotal = Math.max(0, Math.floor(totalPagesRead));
  const level = Math.max(1, Math.floor(safeTotal / pagesPerLevel) + 1);
  const pagesIntoLevel = safeTotal % pagesPerLevel;
  const pagesToNextLevel = pagesPerLevel - pagesIntoLevel || pagesPerLevel;
  const levelProgressPercent = Math.min(
    100,
    Math.round((pagesIntoLevel / pagesPerLevel) * 100)
  );

  return { level, pagesIntoLevel, pagesToNextLevel, levelProgressPercent };
}
