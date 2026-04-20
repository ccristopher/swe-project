"use client";

import { BookOpen, Pencil, X } from "lucide-react";
import type { FinishedBook } from "@/components/home/home-content.data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type BookDetailsModalProps = {
  book: FinishedBook | null;
  onCloseAction: () => void;
  onBookUpdatedAction?: (
    updatedBook: FinishedBook,
    meta?: { newLevelRewards?: string[] }
  ) => void;
};

type BookPatch = {
  pagesRead?: number;
  review?: string;
};

export function BookDetailsModal({ book, onCloseAction, onBookUpdatedAction }: BookDetailsModalProps) {
  if (!book) return null;

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

    const updatedBook: FinishedBook = {
      ...currentBook,
      ...fields,
    };

    onBookUpdatedAction?.(updatedBook, { newLevelRewards });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onCloseAction}
    >
      <div
        className="dashboardPanel relative w-full max-w-md cursor-default p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCloseAction}
          className="absolute right-4 top-4 flex size-9 cursor-pointer items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition hover:text-foreground"
          type="button"
          aria-label="Close book details"
        >
          <X className="size-4" />
        </button>

        <div className="bookCoverFrame mx-auto aspect-2/3 w-36 overflow-hidden rounded-[1.35rem]">
          <img
            src={book.coverUrl || "/defbookcover-min.jpg"}
            className="h-full w-full object-cover"
            alt={`${book.title} cover`}
          />
        </div>

        <h2 className="statValue mt-4 text-2xl">{book.name}</h2>
        <p className="text-sm progressLabel">{book.author}</p>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-on-surface-variant">
            {book.pagesRead || 0} / {book.numberOfPages} pages
          </p>

          <Progress
            aria-label={`${book.name} progress`}
            className="h-3 rounded-full bg-surface-container"
            indicatorClassName="rounded-full bg-primary"
            value={book.numberOfPages ? ((book.pagesRead || 0) / book.numberOfPages) * 100 : 0}
          />
        </div>

        <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
          <BookOpen className="size-3.5" />
          {book.completed ? "Completed" : "In progress"}
        </p>

        <div className="mt-4">
          <p className="text-sm font-bold">Your thoughts</p>
          <p className="text-sm italic">{book.review || "No review yet..."}</p>
        </div>

        <Button
          onClick={async () => {
            const review = prompt("Update your thoughts:");
            if (!review) return;
            await patchBook({ review });
          }}
          className="primaryAction mt-4 h-10 rounded-full px-4 font-display text-sm font-bold"
        >
          <Pencil className="size-4" />
          Edit Review
        </Button>

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
          className="mt-3 block cursor-pointer text-xs font-semibold text-primary-dim hover:text-on-primary-container"
          type="button"
        >
          Update Progress
        </button>
      </div>
    </div>
  );
}
