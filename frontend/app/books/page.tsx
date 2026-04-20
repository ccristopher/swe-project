"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { BookOpen, CheckCircle2, Clock3, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { BookDetailsModal } from "@/components/books/book-details-modal";
import type { FinishedBook } from "@/components/home/home-content.data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BooksPage() {
  const { user } = useUser();
  const [books, setBooks] = useState<FinishedBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<FinishedBook | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/books`)
      .then(res => res.json())
      .then(data => {
        const mappedBooks: FinishedBook[] = (data.books || []).map((book: any) => ({
          _id: book._id,
          author: book.author,
          completed: Boolean(book.completed),
          coverUrl: book.coverUrl || "/defbookcover-min.jpg",
          imageSrc: book.coverUrl || "/defbookcover-min.jpg",
          name: book.name,
          numberOfPages: book.numberOfPages || 0,
          pagesRead: book.pagesRead || 0,
          review: book.review || "",
          title: book.name,
        }));

        setBooks(mappedBooks);
      });
  }, [user]);

  return (
    <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-5xl space-y-5">
        <Card className="dashboardPanel gap-0 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                Library
              </p>
              <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
                Your books
              </h1>
            </div>

            <Button
              asChild
              className="primaryAction h-12 shrink-0 rounded-full px-6 font-display text-base font-bold"
            >
              <Link href="/books/log">
                <Plus className="size-4" />
                Add book
              </Link>
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          {books.length ? (
            books.map((book) => (
              <Card
                key={book._id}
                onClick={() => setSelectedBook(book)}
                className="secondaryAction grid cursor-pointer grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-[1.9rem] p-4 transition-shadow duration-150 hover:shadow-[0_18px_34px_var(--card-shadow)] sm:grid-cols-[112px_minmax(0,1fr)]"
              >
                <div className="bookCoverFrame aspect-2/3 overflow-hidden rounded-[1.35rem]">
                  <img
                    src={book.coverUrl || "/defbookcover-min.jpg"}
                    alt={`${book.name} cover`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 py-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-xl font-extrabold tracking-tight text-foreground">
                        {book.name}
                      </h2>
                      <p className="mt-1 text-sm text-on-surface-variant">{book.author}</p>
                    </div>

                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-surface-container px-3 py-1 text-xs font-bold text-on-surface-variant">
                      {book.completed ? <CheckCircle2 className="size-3.5" /> : <Clock3 className="size-3.5" />}
                      {book.completed ? "Completed" : "In progress"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-on-surface-variant">
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5">
                      <FileText className="size-3.5" />
                      {book.numberOfPages} pages
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5">
                      <BookOpen className="size-3.5" />
                      {book.pagesRead || 0} read
                    </span>
                  </div>

                  {book.review && (
                    <p className="mt-4 line-clamp-2 text-sm italic leading-6 text-on-surface-variant">
                      {book.review}
                    </p>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="dashboardPanel gap-0 p-6 text-sm font-medium text-on-surface-variant">
              No books logged yet. Add your first read to start building your library.
            </Card>
          )}
        </div>
      </div>

      <BookDetailsModal
        book={selectedBook}
        onCloseAction={() => setSelectedBook(null)}
        onBookUpdatedAction={(updatedBook) => {
          setSelectedBook(updatedBook);
          setBooks((prev) => prev.map((book) => (book._id === updatedBook._id ? updatedBook : book)));
        }}
      />
    </section>
  );
}
