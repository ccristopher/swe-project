"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { labelForRewardId } from "@/lib/levelRewards";

export default function LogBookPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    pageCount: "",
  });

  const [loading, setLoading] = useState(false);

  async function submitBook() {
    setLoading(true);

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        pageCount: Number(form.pageCount),
        completed: true,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      const ids = Array.isArray(data.newLevelRewards)
        ? data.newLevelRewards.filter((x: unknown) => typeof x === "string")
        : [];
      if (ids.length) {
        alert(`You earned: ${ids.map(labelForRewardId).join(", ")}`);
      }
      router.push("/profile");
    } else {
      alert(data.error || "Something went wrong");
    }
  }

  return (
    <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-xl space-y-5">
        <Card className="dashboardPanel gap-0 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                Library
              </p>
              <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
                Log a book
              </h1>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Add a finished read and keep your dashboard totals current.
              </p>
            </div>

            <Button
              asChild
              className="secondaryAction h-10 shrink-0 rounded-full px-4 text-sm font-bold"
              variant="outline"
            >
              <Link href="/books">
                <ArrowLeft className="size-4" />
                Back
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="dashboardPanel gap-0 p-5 sm:p-6">
          <div className="space-y-4">
          <input
            className="dashboardInput w-full px-4 py-3 text-sm"
            placeholder="Book Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="dashboardInput w-full px-4 py-3 text-sm"
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <input
            className="dashboardInput w-full px-4 py-3 text-sm"
            placeholder="Genre"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
          />

          <input
            className="dashboardInput w-full px-4 py-3 text-sm"
            placeholder="ISBN (optional)"
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          />

          <input
            className="dashboardInput w-full px-4 py-3 text-sm"
            inputMode="numeric"
            placeholder="Page Count"
            value={form.pageCount}
            onChange={(e) => setForm({ ...form, pageCount: e.target.value })}
          />

          <Button
            onClick={submitBook}
            disabled={loading}
            className="primaryAction h-14 w-full rounded-full font-display text-lg font-bold"
          >
            <BookPlus className="size-5" />
            {loading ? "Logging..." : "Add book"}
          </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
