"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PetAvatar } from "@/components/pet-avatar";
import { Card } from "@/components/ui/card";
import {
  cleanEquippedItems,
  getPetItem,
  isPetItemUnlocked,
  petItems,
  petItemSlots,
  type EquippedItems,
} from "@/lib/petItems";

const slotNames = {
  head: "Head",
  neck: "Neck",
  treat: "Treat",
};

export default function CustomizePetPage() {
  const { user } = useUser();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/users/profile?userId=${user.id}`)
      .then((res) => res.json())
      .then(setData);
  }, [user]);

  async function save(next: EquippedItems) {
    const res = await fetch("/api/users/pet/equipment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equippedItems: next }),
    });
    const saved = await res.json().catch(() => ({}));
    if (!res.ok) return alert(saved?.error || "Could not save item");
    setData((prev: any) => ({ ...prev, pet: saved.pet }));
  }

  if (!data) {
    return (
      <div className="px-6 py-10 text-center text-on-surface-variant">
        Loading...
      </div>
    );
  }

  const equipped = cleanEquippedItems(data.pet?.equippedItems);
  const rewards = Array.isArray(data.user?.unlockedRewards)
    ? data.user.unlockedRewards.filter((reward: unknown) => typeof reward === "string")
    : [];

  return (
    <section className="px-6 pb-16 pt-4 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
              Pet Closet
            </p>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
              Customize Pet
            </h1>
          </div>

          <Link
            href="/profile"
            className="rounded-full bg-surface-container px-4 py-2 text-sm font-bold text-foreground"
          >
            Back
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="rounded-[2.25rem] border-0 bg-surface-container-low p-5 shadow-[0_14px_30px_var(--card-shadow)]">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
              Accessories
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {petItems.map((item) => {
                const unlocked = isPetItemUnlocked(item.id, rewards);
                const equippedNow = equipped[item.slot] === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={!unlocked}
                    onClick={() => save({ ...equipped, [item.slot]: equippedNow ? null : item.id })}
                    className={`rounded-[1.5rem] bg-surface-container p-3 text-left shadow-sm transition ${
                      equippedNow ? "ring-3 ring-primary" : "hover:scale-[1.02]"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                    type="button"
                  >
                    <div className="flex aspect-square items-center justify-center rounded-[1.25rem] bg-secondary-container">
                      <img src={item.image} alt={item.name} className="image-pixel h-20 w-20 object-contain" />
                    </div>
                    <p className="mt-2 truncate text-sm font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {!unlocked ? `Level ${item.unlockLevel}` : equippedNow ? "Equipped" : slotNames[item.slot]}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="rounded-[2.25rem] border-0 bg-surface-container-low p-5 shadow-[0_14px_30px_var(--card-shadow)]">
            <div className="flex h-80 items-center justify-center rounded-[2rem] bg-secondary-container">
              <PetAvatar
                imageSrc={data.pet?.imageID || "/gator....png"}
                equippedItems={equipped}
                className="h-56 w-56"
              />
            </div>
            <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground">
              Equipped
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {petItemSlots.map((slot) => {
                const item = getPetItem(equipped[slot]);
                return (
                  <button
                    key={slot}
                    onClick={() => item && save({ ...equipped, [slot]: null })}
                    className="flex h-24 flex-col items-center justify-center rounded-[1.25rem] bg-surface-container p-2 text-xs font-bold text-on-surface-variant transition hover:scale-[1.02]"
                    type="button"
                  >
                    <span>{slotNames[slot]}</span>
                    {item ? (
                      <img src={item.image} alt={item.name} className="image-pixel mx-auto mt-2 h-12 w-12 object-contain" />
                    ) : (
                      <span className="mt-3 block text-on-surface-variant/70">Empty</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
