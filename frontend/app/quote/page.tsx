"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, Quote, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-xl space-y-6">

        <Card className="dashboardPanel gap-0 p-6 sm:p-7">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
            <Quote className="size-4 text-tertiary" />
            Profile
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Add quote
          </h1>

          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Save a meaningful line from your reading (max 300 characters)
          </p>
        </Card>

        <Card className="dashboardPanel gap-0 p-5 sm:p-6">
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Write your favorite quote..."
            className="dashboardInput h-44 w-full resize-none p-4 text-sm leading-6"
          />

          <div className="mt-3 flex items-center justify-between text-xs">
            <span
              className={
                remaining < 20
                  ? "text-destructive"
                  : "text-on-surface-variant"
              }
            >
              {remaining} characters left
            </span>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            asChild
            className="secondaryAction h-12 flex-1 rounded-full font-display text-sm font-bold"
            variant="outline"
          >
            <Link href="/profile">
              <ArrowLeft className="size-4" />
              Cancel
            </Link>
          </Button>

          <Button
            onClick={handleSave}
            disabled={loading || quote.trim().length === 0}
            className="primaryAction h-12 flex-1 rounded-full font-display text-sm font-bold disabled:opacity-50"
          >
            <Save className="size-4" />
            {loading ? "Saving..." : "Save Quote"}
          </Button>
        </div>

      </div>
    </section>
  );
}
