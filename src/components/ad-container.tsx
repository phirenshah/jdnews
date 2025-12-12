import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type AdContainerProps = {
  type: 'horizontal' | 'vertical';
  className?: string;
};

export function AdContainer({ type, className }: AdContainerProps) {
  const adImage =
    type === 'horizontal'
      ? PlaceHolderImages.find((img) => img.id === 'ad-banner-horizontal')
      : PlaceHolderImages.find((img) => img.id === 'ad-banner-vertical');

  if (!adImage) return null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-muted/50 border border-dashed rounded-lg p-4 space-y-2 text-muted-foreground text-xs',
        className
      )}
    >
      <span className="font-semibold">Advertisement</span>
      <div className="relative w-full overflow-hidden">
        <Image
          src={adImage.imageUrl}
          alt="Advertisement"
          width={type === 'horizontal' ? 728 : 300}
          height={type === 'horizontal' ? 90 : 600}
          data-ai-hint={adImage.imageHint}
          className="object-cover"
        />
      </div>
    </div>
  );
}
