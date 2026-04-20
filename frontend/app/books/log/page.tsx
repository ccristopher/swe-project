"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[2.125rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Log a Book 🐊
        </h1>

        <div className="space-y-4">

          <input
            className="w-full rounded-[1.25rem] border border-border bg-surface-container-highest p-3 outline-none focus:border-primary focus:ring-3 focus:ring-ring/40"
            placeholder="Book Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="w-full rounded-[1.25rem] border border-border bg-surface-container-highest p-3 outline-none focus:border-primary focus:ring-3 focus:ring-ring/40"
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <input
            className="w-full rounded-[1.25rem] border border-border bg-surface-container-highest p-3 outline-none focus:border-primary focus:ring-3 focus:ring-ring/40"
            placeholder="Genre"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
          />

          <input
            className="w-full rounded-[1.25rem] border border-border bg-surface-container-highest p-3 outline-none focus:border-primary focus:ring-3 focus:ring-ring/40"
            placeholder="ISBN (optional)"
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          />

          <input
            className="w-full rounded-[1.25rem] border border-border bg-surface-container-highest p-3 outline-none focus:border-primary focus:ring-3 focus:ring-ring/40"
            placeholder="Page Count"
            value={form.pageCount}
            onChange={(e) => setForm({ ...form, pageCount: e.target.value })}
          />

          <Button
            onClick={submitBook}
            disabled={loading}
            className="primaryAction h-14 w-full rounded-full font-display text-lg font-bold text-accent-foreground"
          >
            {loading ? "Logging..." : "Add Book"}
          </Button>

        </div>
      </div>
    </div>
  );
}
