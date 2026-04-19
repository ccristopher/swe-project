"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MAX_CHARS = 300;

export default function QuotePage() {
  const { user } = useUser();
  const router = useRouter();

  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);

  const remaining = MAX_CHARS - quote.length;

  async function handleSave() {
    if (!user?.id) return;

    setLoading(true);

    try {
      const res = await fetch("/api/users/quote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          quote,
        }),
      });

      if (!res.ok) {
        alert("Failed to save quote");
        return;
      }

      router.push("/profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-6 pb-16 pt-6 sm:px-8">
      <div className="mx-auto max-w-xl space-y-6">

        {/* HEADER */}
        <div className="rounded-[2.5rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Add Quote 💬
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant">
            Save a meaningful line from your reading (max 300 characters)
          </p>
        </div>

        {/* INPUT CARD */}
        <div className="rounded-[2rem] bg-surface-container p-5 shadow-sm">
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Write your favorite quote..."
            className="h-44 w-full resize-none bg-transparent text-sm outline-none text-on-surface"
          />

          {/* footer */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <span
              className={
                remaining < 20
                  ? "text-red-400"
                  : "text-on-surface-variant"
              }
            >
              {remaining} characters left
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <Link
            href="/profile"
            className="flex-1 rounded-full bg-surface-container px-4 py-3 text-center text-sm font-semibold"
          >
            Cancel
          </Link>

          <button
            onClick={handleSave}
            disabled={loading || quote.trim().length === 0}
            className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Quote"}
          </button>
        </div>

      </div>
    </section>
  );
}