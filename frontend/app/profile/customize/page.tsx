"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Check, Lock } from "lucide-react";
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
    <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-7xl space-y-5">
        <Card className="rounded-[2.125rem] border-0 bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                Pet Closet
              </p>
              <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
                Customize Pet
              </h1>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Equip rewards and preview your reading companion.
              </p>
            </div>

            <Link
              href="/profile"
              className="secondaryAction inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 font-display text-sm font-bold text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="rounded-[2.125rem] border-0 bg-surface-container-low p-5 shadow-[0_14px_30px_var(--card-shadow)] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Wardrobe
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-foreground">
                  Accessories
                </h2>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {petItems.map((item) => {
                const unlocked = isPetItemUnlocked(item.id, rewards);
                const equippedNow = equipped[item.slot] === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={!unlocked}
                    onClick={() => save({ ...equipped, [item.slot]: equippedNow ? null : item.id })}
                    className={`relative cursor-pointer rounded-[1.65rem] border border-border bg-surface-container p-3 text-left shadow-sm transition-shadow ${
                      equippedNow ? "ring-3 ring-primary bg-primary-container/45" : "hover:shadow-[0_10px_20px_var(--card-shadow)]"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                    type="button"
                  >
                    <div className="petStage flex aspect-square items-center justify-center rounded-[1.35rem]">
                      <img src={item.image} alt={item.name} className="image-pixel h-20 w-20 object-contain" />
                    </div>
                    {(!unlocked || equippedNow) && (
                      <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant shadow-[0_6px_14px_var(--card-shadow)]">
                        {!unlocked ? <Lock className="size-3.5" /> : <Check className="size-4 text-primary" />}
                      </span>
                    )}
                    <p className="mt-2 truncate text-sm font-bold text-foreground">{item.name}</p>
                    <p className="text-xs font-semibold text-on-surface-variant">
                      {!unlocked ? `Level ${item.unlockLevel}` : equippedNow ? "Equipped" : slotNames[item.slot]}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="rounded-[2.125rem] border-0 bg-surface-container-low p-5 shadow-[0_14px_30px_var(--card-shadow)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
              Preview
            </p>
            <div className="petStage relative mt-4 flex h-80 items-center justify-center rounded-[2rem]">
              <div className="absolute bottom-8 h-5 w-32 rounded-full bg-foreground/15 blur-md" />
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
                    disabled={!item}
                    className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-border bg-surface-container p-2 text-xs font-bold text-on-surface-variant transition-shadow hover:shadow-[0_10px_20px_var(--card-shadow)] disabled:cursor-default disabled:opacity-70 disabled:hover:shadow-none"
                    type="button"
                    title={item ? `Remove ${item.name}` : `${slotNames[slot]} slot empty`}
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
