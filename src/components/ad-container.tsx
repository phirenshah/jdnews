
'use client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type AdContainerProps = {
  type: 'horizontal' | 'vertical';
  className?: string;
};

type Ad = {
  id: string;
  name: string;
  type: 'image' | 'html';
  url?: string;
  htmlCode?: string;
};

export function AdContainer({ type, className }: AdContainerProps) {
  const { firestore } = useFirebase();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const adsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'advertisements'))
        : null,
    [firestore]
  );
  
  const { data: ads, isLoading } = useCollection<Ad>(adsQuery);

  useEffect(() => {
    if (!ads || ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [ads]);

  const adToDisplay = ads && ads.length > 0 ? ads[currentAdIndex] : null;

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

  const adWidth = type === 'horizontal' ? 728 : 300;
  const adHeight = type === 'horizontal' ? 90 : 600;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-muted/50 border border-dashed rounded-lg p-4 space-y-2 text-muted-foreground text-xs',
        className
      )}
      style={{width: `${adWidth + 32}px`, height: `${adHeight + 40}px`}}
    >
      <span className="font-semibold">Advertisement</span>
      <div className="relative" style={{width: `${adWidth}px`, height: `${adHeight}px`}}>
        {adToDisplay.type === 'image' && adToDisplay.url ? (
          <Image
            src={adToDisplay.url}
            alt={adToDisplay.name}
            width={adWidth}
            height={adHeight}
            className="object-cover"
          />
        ) : adToDisplay.type === 'html' && adToDisplay.htmlCode ? (
          <div
            dangerouslySetInnerHTML={{ __html: adToDisplay.htmlCode }}
            className="w-full h-full"
          />
        ) : null}
      </div>
    </div>
  );
}
