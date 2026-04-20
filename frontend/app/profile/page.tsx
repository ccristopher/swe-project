"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PetAvatar } from "@/components/pet-avatar";
import { Card } from "@/components/ui/card";
import { cleanEquippedItems } from "@/lib/petItems";

export default function ProfilePage() {
  const { user } = useUser();

  const [data, setData] = useState<any>(null);
  const [quote, setQuote] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const [editingName, setEditingName] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/users/profile?userId=${user.id}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);

        setQuote(res.pet?.quote || "");

        setUsername(res.user?.username || "");
      });
  }, [user]);

  async function updateQuote() {
    const newQuote = prompt("Write a quote from your book:");
    if (!newQuote) return;

    const res = await fetch("/api/users/quote", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote: newQuote }),
    });
    if (!res.ok) {
      alert("Could not save quote");
      return;
    }

    const saved = await res.json();
    setQuote(typeof saved.quote === "string" ? saved.quote : newQuote);
  }

  async function saveUsername() {
    const nextUsername = username.trim();

    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: nextUsername }),
    });

    const saved = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(saved?.error || "Could not save username");
      return;
    }

    setUsername(saved.username);
    setData((prev: any) =>
      prev
        ? {
            ...prev,
            user: {
              ...prev.user,
              username: saved.username,
            },
          }
        : prev
    );
    setEditingName(false);
  }

  if (!data) {
    return (
      <div className="px-6 py-10 text-center text-on-surface-variant">
        Loading profile...
      </div>
    );
  }

  const booksPreview = data.books?.slice(0, 6);
  const equippedItems = cleanEquippedItems(data.pet?.equippedItems);

  return (
    <section className="px-6 pb-16 pt-4 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* HERO / PET */}
        <Card className="relative overflow-hidden rounded-[2.5rem] border-0 bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                Profile
              </p>

              {editingName ? (
                <div className="mt-1 flex items-center gap-2">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-transparent border-b border-border outline-none font-display text-3xl font-extrabold"
                  />
                  <button
                    onClick={saveUsername}
                    type="button"
                    className="cursor-pointer text-sm font-bold text-primary"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h1
                  onClick={() => setEditingName(true)}
                  className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground cursor-pointer hover:opacity-80"
                >
                  {username}
                </h1>
              )}
            </div>

            {/* Leaderboard badge (among friends) */}
            <div className="starBadge px-3 py-1 rounded-full text-sm">
              #{data.user?.rank ?? "-"}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-center">

            {/* PET */}
            <Link
              href="/profile/customize"
              className="petStage relative flex min-h-72 cursor-pointer items-center justify-center rounded-[2rem] transition-shadow hover:shadow-[0_14px_30px_var(--card-shadow)]"
            >
              <div className="absolute top-3 left-3 starBadge px-3 py-1 rounded-full text-sm">
                Lv {data.level?.level ?? 1}
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-surface-container px-3 py-1 text-xs font-bold text-on-surface-variant">
                Customize
              </div>
              <div className="absolute bottom-6 w-24 h-4 bg-black/20 blur-md rounded-full" />
              <PetAvatar
                imageSrc={data.pet?.imageID || "/gator....png"}
                equippedItems={equippedItems}
                alt="Pet"
                className="h-48 w-48"
              />
            </Link>

            {/* QUOTE + CTA */}
            <div className="space-y-4">

              {/* Quote Display */}
              <Card
                onClick={updateQuote}
                className="cursor-pointer rounded-[1.75rem] border-0 bg-surface-container-highest p-5 shadow-[0_10px_24px_var(--card-shadow)]"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Quote
                </p>

                <p className="mt-2 text-sm italic text-on-surface-variant leading-relaxed">
                  {quote || "💬 Share a meaningful quote from your reading"}
                </p>
              </Card>

            </div>

          </div>
        </Card>

        {/* BOOKS SECTION */}
        <section>
          <Card className="rounded-[2.25rem] border-0 bg-surface-container-low p-5 shadow-[0_14px_30px_var(--card-shadow)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                Books Read
              </h2>

              <Link href="/books" className="text-sm font-semibold text-primary hover:opacity-80">
                View all
              </Link>
            </div>

            {booksPreview?.length ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {booksPreview.map((book: any) => (
                  <div
                    key={book._id}
                    onClick={() => setSelectedBook(book)}
                    className="cursor-pointer transition-opacity hover:opacity-85"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden rounded-[1.25rem] bg-surface-container shadow-sm">
                      <img
                        src={book.coverUrl || "/defbookcover-min.jpg"}
                        alt={book.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <p className="mt-1 truncate text-center text-[10px] text-on-surface-variant">
                      {book.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">
                No books yet. Start reading to build your collection.
              </p>
            )}
          </Card>
        </section>
      </div>

      {selectedBook && (
        <div
          className="fixed inset-0 bg-black/40 flex cursor-pointer items-center justify-center z-50"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="relative w-[90%] max-w-md cursor-default rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-3 right-3 cursor-pointer"
            >
              ✖
            </button>

            {/* COVER */}
            <img
              src={selectedBook.coverUrl || "/defbookcover-min.jpg"}
              alt={`${selectedBook.name} cover`}
              className="h-48 w-full rounded-[1.25rem] object-cover"
            />

            {/* TITLE */}
            <h2 className="mt-4 text-lg font-bold statValue">
              {selectedBook.name}
            </h2>

            <p className="text-sm progressLabel">
              {selectedBook.author}
            </p>

            {/* PROGRESS BAR */}
            <div className="mt-4">
              <p className="text-xs mb-1">
                {selectedBook.pagesRead || 0} / {selectedBook.numberOfPages} pages
              </p>

              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${
                      selectedBook.numberOfPages
                        ? ((selectedBook.pagesRead || 0) / selectedBook.numberOfPages) * 100
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>

            {/* STATUS */}
            <p className="text-xs mt-2">
              {selectedBook.completed ? "✅ Completed" : "📖 In Progress"}
            </p>

            {/* REVIEW */}
            <div className="mt-4">
              <p className="text-sm font-bold">Your thoughts</p>
              <p className="text-sm italic">
                {selectedBook.review || "No review yet..."}
              </p>
            </div>

            {/* EDIT REVIEW */}
            <button
              onClick={async () => {
                const review = prompt("Update your thoughts:");
                if (!review) return;

                await fetch(`/api/books/${selectedBook._id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ review }),
                });

                // update UI instantly
                setSelectedBook({ ...selectedBook, review });

                setData((prev: any) => ({
                  ...prev,
                  books: prev.books.map((b: any) =>
                    b._id === selectedBook._id ? { ...b, review } : b
                  ),
                }));
              }}
              className="primaryAction mt-4 cursor-pointer rounded-full px-4 py-2 text-sm text-accent-foreground"
            >
              Edit Review
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
