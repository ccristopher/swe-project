"use client";

import type { FinishedBook } from "@/components/home/home-content.data";

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
      className="fixed inset-0 bg-black/40 flex cursor-pointer items-center justify-center z-50"
      onClick={onCloseAction}
    >
      <div
        className="relative w-[90%] max-w-md cursor-default rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onCloseAction} className="absolute top-3 right-3 cursor-pointer">
          ✖
        </button>

        <img
          src={book.coverUrl || "/defbookcover-min.jpg"}
          className="h-48 w-full rounded-[1.25rem] object-cover"
          alt={`${book.title} cover`}
        />

        <h2 className="mt-4 text-lg font-bold statValue">{book.name}</h2>
        <p className="text-sm progressLabel">{book.author}</p>

        <div className="mt-4">
          <p className="text-xs mb-1">
            {book.pagesRead || 0} / {book.numberOfPages} pages
          </p>

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
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

        <p className="text-xs mt-2">
          {book.completed ? "✅ Completed" : "📖 In Progress"}
        </p>

        <div className="mt-4">
          <p className="text-sm font-bold">Your thoughts</p>
          <p className="text-sm italic">{book.review || "No review yet..."}</p>
        </div>

        <button
          onClick={async () => {
            const review = prompt("Update your thoughts:");
            if (!review) return;
            await patchBook({ review });
          }}
          className="primaryAction mt-4 cursor-pointer rounded-full px-4 py-2 text-sm text-accent-foreground"
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
          className="mt-2 cursor-pointer text-xs underline"
        >
          Update Progress
        </button>
      </div>
    </div>
  );
}
