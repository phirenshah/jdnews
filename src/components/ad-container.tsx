
'use client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

type AdContainerProps = {
  type: 'horizontal' | 'vertical';
  className?: string;
};

type Ad = {
  id: string;
  name: string;
  type: 'image' | 'iframe';
  url: string;
  placement: 'horizontal' | 'vertical';
};

export function AdContainer({ type, className }: AdContainerProps) {
  const { firestore } = useFirebase();

  const adsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'advertisements'),
            where('placement', '==', type)
          )
        : null,
    [firestore, type]
  );
  
  const { data: ads, isLoading } = useCollection<Ad>(adsQuery);

  const adToDisplay = ads && ads.length > 0 ? ads[0] : null;

  if (isLoading) {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center bg-muted/50 border border-dashed rounded-lg p-4 space-y-2 text-muted-foreground text-xs animate-pulse',
            type === 'vertical' ? 'h-[600px] w-[300px]' : 'h-[90px] w-[728px]',
            className
          )}>
            <span className="font-semibold">Advertisement</span>
        </div>
    )
  }

  if (!adToDisplay) {
    // Optional: Render a placeholder or nothing if no ad is found
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-muted/50 border border-dashed rounded-lg p-4 space-y-2 text-muted-foreground text-xs',
        className
      )}
    >
      <span className="font-semibold">Advertisement</span>
      <div className="relative w-full">
        {adToDisplay.type === 'image' ? (
          <Image
            src={adToDisplay.url}
            alt={adToDisplay.name}
            width={type === 'horizontal' ? 728 : 300}
            height={type === 'horizontal' ? 90 : 600}
            className="object-cover"
          />
        ) : (
          <iframe
            src={adToDisplay.url}
            width={type === 'horizontal' ? '728' : '300'}
            height={type === 'horizontal' ? '90' : '600'}
            style={{ border: 0 }}
            allowFullScreen
            title={adToDisplay.name}
          />
        )}
      </div>
    </div>
  );
}
