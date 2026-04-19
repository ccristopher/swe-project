"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FriendProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/users/profile?userId=${id}`)
      .then(res => res.json())
      .then(setData);
  }, [id]);

  if (!data) return <div className="p-6">Loading...</div>;

  const booksPreview = data.books?.slice(0, 6);

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-md space-y-6">

        {/* PET */}
        <div className="petStage relative h-[50vh] rounded-2xl flex flex-col items-center justify-center text-center p-4">

          <img
            src={data.pet?.imageID}
            className="w-32 h-32 z-10"
          />

          <div className="absolute top-3 right-3 starBadge px-3 py-1 rounded-full text-sm z-10">
            Lv {data.level?.level ?? 1}
          </div>

          <h1 className="text-xl font-bold statValue mt-2">
            {data.user?.username}
          </h1>

          <div className="mt-4 secondaryAction px-4 py-3 rounded-xl max-w-xs">
            <p className="progressLabel">
              {data.pet?.quote || "No quote yet"}
            </p>
          </div>
        </div>

        {/* BOOKS PREVIEW */}
        <div>
          <h2 className="streakCopy text-lg font-bold mb-2">
            Recently Read
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {booksPreview?.map((book: any) => (
              <div
                key={book._id}
                className="secondaryAction rounded-lg overflow-hidden p-2"
              >
                <img
                  src={book.coverUrl || "/defbookcover-min.jpg"}
                  className="w-full h-28 object-cover rounded-md"
                />
                <p className="text-xs mt-1 truncate">
                  {book.name}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}