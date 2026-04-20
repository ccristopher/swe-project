"use client";

import type { FinishedBook } from "@/components/home/home-content.data";
import Image from "next/image";
import { canMarkBookCompleted, getBookStatus } from "@/lib/readingProgress";
import { BookStatusIndicator } from "@/components/books/book-status-indicator";

type BookDetailsModalProps = {
  book: FinishedBook | null;
  onCloseAction: () => void;
  onBookDeletedAction?: (deletedBookId: string) => void;
  onBookUpdatedAction?: (
    updatedBook: FinishedBook,
    meta?: {
      newLevelRewards?: string[];
      petEquippedItems?: Record<string, string | null>;
      userProgress?: { booksCompleted?: number; totalPagesRead?: number };
      unlockedRewards?: string[];
    }
  ) => void;
};

type BookPatch = {
  completed?: boolean;
  dnf?: boolean;
  pagesRead?: number;
  review?: string;
};

export function BookDetailsModal({
  book,
  onCloseAction,
  onBookDeletedAction,
  onBookUpdatedAction,
}: BookDetailsModalProps) {
  if (!book) return null;

  const status = getBookStatus(book);
  const completionEligible = canMarkBookCompleted(book);

  async function patchBook(fields: BookPatch) {
    const currentBook = book;
    if (!currentBook || !currentBook._id) return;

    const response = await fetch(`/api/books/${currentBook._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      alert(data?.error || "Could not update book");
      return;
    }

    const data = await response.json().catch(() => ({}));
    const newLevelRewards = Array.isArray(data?.newLevelRewards)
      ? data.newLevelRewards.filter((x: unknown) => typeof x === "string")
      : [];
    const unlockedRewards = Array.isArray(data?.unlockedRewards)
      ? data.unlockedRewards.filter((x: unknown) => typeof x === "string")
      : undefined;
    const petEquippedItems =
      data?.pet?.equippedItems && typeof data.pet.equippedItems === "object"
        ? data.pet.equippedItems
        : undefined;
    const userProgress =
      data?.userProgress && typeof data.userProgress === "object" ? data.userProgress : undefined;

    const updatedBook: FinishedBook = {
      ...currentBook,
      ...(data?.book && typeof data.book === "object" ? data.book : fields),
    };

    onBookUpdatedAction?.(updatedBook, {
      newLevelRewards,
      petEquippedItems,
      unlockedRewards,
      userProgress,
    });
  }

  async function deleteBook() {
    const currentBook = book;
    if (!currentBook?._id) return;

    const confirmed = window.confirm(`Delete "${currentBook.name}" from your log?`);
    if (!confirmed) return;

    const response = await fetch(`/api/books/${currentBook._id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      alert(data?.error || "Could not delete book");
      return;
    }

    await response.json().catch(() => ({}));
    onBookDeletedAction?.(currentBook._id);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/40"
      onClick={onCloseAction}
    >
      <div
        className="relative w-[90%] max-w-md cursor-default rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onCloseAction} className="absolute right-3 top-3 cursor-pointer">
          x
        </button>

        <div className="relative h-48 w-full overflow-hidden rounded-[1.25rem]">
          <Image
            src={book.coverUrl || "/defbookcover-min.jpg"}
            fill
            sizes="(max-width: 768px) 90vw, 448px"
            className="object-cover"
            alt={`${book.title} cover`}
          />
        </div>

        <h2 className="mt-4 text-lg font-bold statValue">{book.name}</h2>
        <p className="text-sm progressLabel">{book.author}</p>

        <div className="mt-4">
          <p className="mb-1 text-xs">
            {book.pagesRead || 0} / {book.numberOfPages} pages
          </p>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-primary"
              style={{
                width: `${
                  book.numberOfPages ? ((book.pagesRead || 0) / book.numberOfPages) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>

        <BookStatusIndicator className="mt-3" status={status} />

        <div className="mt-4">
          <p className="text-sm font-bold">Your thoughts</p>
          <p className="text-sm italic">{book.review || "No review yet..."}</p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            onClick={async () => {
              await patchBook({ completed: true, dnf: false });
            }}
            disabled={status === "completed" || !completionEligible}
            className="primaryAction cursor-pointer rounded-full px-4 py-2 text-sm text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "completed" ? "Completed" : "Mark Completed"}
          </button>

          <button
            onClick={async () => {
              await patchBook(status === "dnf" ? { completed: false, dnf: false } : { dnf: true });
            }}
            className="cursor-pointer rounded-full border border-border bg-surface-container px-4 py-2 text-sm font-semibold text-foreground"
          >
            {status === "dnf" ? "Resume Book" : "Mark DNF"}
          </button>
        </div>

        <p className="mt-2 text-xs text-on-surface-variant">
          {completionEligible
            ? "This book can be marked complete because it has at least 90% progress."
            : "Read at least 90% of the book before marking it complete."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={async () => {
              const review = prompt("Update your thoughts:");
              if (!review) return;
              await patchBook({ review });
            }}
            className="primaryAction cursor-pointer rounded-full px-4 py-2 text-sm text-accent-foreground"
          >
            Edit Review
          </button>

          <button
            onClick={async () => {
              const pages = prompt("Update pages read:");
              if (!pages) return;

              const pagesNum = Number(pages);
              if (!Number.isFinite(pagesNum) || pagesNum < 0) {
                alert("Please enter a valid non-negative number");
                return;
              }

              await patchBook({ pagesRead: Math.floor(pagesNum) });
            }}
            className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Update Progress
          </button>

          <button
            onClick={deleteBook}
            className="cursor-pointer rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive"
          >
            Delete Book
          </button>
        </div>
      </div>
    </div>
  );
}
