import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { FinishedBook } from './home-content.data';
import styles from './home-page-content.module.css';

type FinishedBookCardProps = FinishedBook & {
  onClick?: () => void;
};

export function FinishedBookCard({ author, imageSrc, onClick, title }: FinishedBookCardProps) {
  return (
    <Card
      className={`gap-0 rounded-[1.9rem] border-0 bg-surface-container-low p-3 shadow-[0_14px_30px_var(--card-shadow)] transition-transform duration-150 hover:-translate-y-1 hover:shadow-[0_18px_34px_var(--card-shadow)] ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div
        className={`relative mx-auto aspect-2/3 w-full max-w-40 overflow-hidden rounded-[1.45rem] ${styles.finishedBookCoverFrame}`}
      >
        <Image
          src={imageSrc}
          alt={`${title} book cover`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover object-center"
        />
      </div>

      <div className="px-1 pb-1 pt-3">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-on-surface-variant">{author}</p>
      </div>
    </Card>
  );
}
