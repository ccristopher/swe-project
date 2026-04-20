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
    const pageCountNum = Number(form.pageCount);
    if (!Number.isFinite(pageCountNum) || pageCountNum <= 0) {
      alert("Page count must be a positive number");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        pageCount: Math.floor(pageCountNum),
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-surface-container-low p-6 shadow-xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Log a Book 🐊
        </h1>

        <div className="space-y-4">

          <input
            className="w-full p-3 rounded-xl bg-surface-container-highest"
            placeholder="Book Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="w-full p-3 rounded-xl bg-surface-container-highest"
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <input
            className="w-full p-3 rounded-xl bg-surface-container-highest"
            placeholder="Genre"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
          />

          <input
            className="w-full p-3 rounded-xl bg-surface-container-highest"
            placeholder="ISBN (optional)"
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          />

          <input
            className="w-full p-3 rounded-xl bg-surface-container-highest"
            type="number"
            min={1}
            step={1}
            placeholder="Page Count"
            value={form.pageCount}
            onChange={(e) => setForm({ ...form, pageCount: e.target.value })}
          />

          <Button
            onClick={submitBook}
            disabled={loading}
            className={`w-full h-14 text-lg font-bold rounded-full primaryAction`}
          >
            {loading ? "Logging..." : "Add Book"}
          </Button>

        </div>
      </div>
    </div>
  );
}