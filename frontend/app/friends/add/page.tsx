"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
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
    <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-xl space-y-6">

        <Card className="dashboardPanel gap-0 p-6 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
            Social
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
            Add friend
          </h1>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Enter a username to add someone to your reading circle.
          </p>
        </Card>

        <Card className="dashboardPanel gap-0 space-y-3 p-5 sm:p-6">
          <input
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            placeholder="Username"
            className="dashboardInput w-full px-4 py-3 text-sm"
          />

          {message && (
            <p className="text-sm font-semibold text-on-surface-variant">{message}</p>
          )}
        </Card>

        <div className="flex gap-3">
          <Button
            asChild
            className="secondaryAction h-12 flex-1 rounded-full font-display text-sm font-bold"
            variant="outline"
          >
            <Link href="/friends">
              <ArrowLeft className="size-4" />
              Cancel
            </Link>
          </Button>

          <Button
            onClick={handleAddFriend}
            disabled={loading || !friendUsername.trim()}
            className="primaryAction h-12 flex-1 rounded-full font-display text-sm font-bold"
          >
            <UserPlus className="size-4" />
            {loading ? "Adding..." : "Add friend"}
          </Button>
        </div>

      </div>
    </section>
  );
}
