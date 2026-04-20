"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddFriendPage() {
  const router = useRouter();

  const [friendUsername, setFriendUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddFriend() {
    if (!friendUsername.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/friends/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendUsername }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }

      setMessage("Friend added!");
      setFriendUsername("");

      setTimeout(() => router.push("/friends"), 800);
    } catch (err) {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-6 pb-16 pt-6 sm:px-8">
      <div className="mx-auto max-w-xl space-y-6">

        <Card className="rounded-[2.125rem] border-0 bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Add Friend 👥</h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Enter a username
          </p>
        </Card>

        <Card className="space-y-3 rounded-[2rem] border-0 bg-surface-container p-5 shadow-[0_10px_24px_var(--card-shadow)]">
          <input
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded-[1.25rem] border border-border bg-surface-container-low px-4 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-ring/40"
          />

          {message && (
            <p className="text-xs text-on-surface-variant">{message}</p>
          )}
        </Card>

        <div className="flex gap-3">
          <Link
            href="/friends"
            className="secondaryAction flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold"
          >
            Cancel
          </Link>

          <Button
            onClick={handleAddFriend}
            disabled={loading || !friendUsername.trim()}
            className="primaryAction flex-1 rounded-full font-display font-bold text-accent-foreground"
          >
            {loading ? "Adding..." : "Add Friend"}
          </Button>
        </div>

      </div>
    </section>
  );
}
