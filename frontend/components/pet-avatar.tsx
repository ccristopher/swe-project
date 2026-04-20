import {
  cleanEquippedItems,
  getPetItem,
  petItemSlots,
  type EquippedItems,
} from "@/lib/petItems";

type PetAvatarProps = {
  imageSrc?: string;
  equippedItems?: Partial<EquippedItems> | null;
  alt?: string;
  className?: string;
};

const itemPositions = {
  head: "left-1/2 top-[0%] h-[100%] w-[100%] -translate-x-1/2",
  neck: "left-1/2 top-[0%] h-[100%] w-[100%] -translate-x-1/2",
  treat: "bottom-[-30%] right-[0%] h-[100%] w-[100%]",
};

export function PetAvatar({
  imageSrc = "/gator....png",
  equippedItems,
  alt = "Pet",
  className = "",
}: PetAvatarProps) {
  const equipped = cleanEquippedItems(equippedItems);

  return (
    <div className={`relative h-48 w-48 ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className="image-pixel h-full w-full object-contain object-center"
      />

      {petItemSlots.map((slot) => {
        const item = getPetItem(equipped[slot]);

        if (!item) return null;

        return (
          <img
            key={slot}
            src={item.image}
            alt=""
            aria-hidden="true"
            className={`image-pixel pointer-events-none absolute object-contain ${itemPositions[slot]}`}
          />
        );
      })}
    </div>
  );
}
