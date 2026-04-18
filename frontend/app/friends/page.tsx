"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function FriendsPage() {
  const { user } = useUser();
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/friends?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setFriends(data.friends || []));
  }, [user]);

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-2xl space-y-4">

        <h1 className="text-2xl font-bold statValue">
          Friends
        </h1>

        <Link href="/profile">
            <Button className="secondaryAction">
                ← Back
            </Button>
        </Link>

        {friends.map((friend) => (
          <Link
            key={friend._id}
            href={`/friends/${friend._id}`}
            className="secondaryAction p-4 rounded-xl flex items-center justify-between"
          >
            <div>
              <p className="font-bold">
                {friend.username || "No username"}
              </p>
              <p className="text-xs progressLabel">
                View profile →
              </p>
            </div>

            <img
              src={friend.pet?.imageID || "/placeholder_pet.png"}
              className="w-12 h-12 rounded-full"
            />
          </Link>
        ))}

      </div>
    </div>
  );
}