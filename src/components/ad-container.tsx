
'use client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type AdContainerProps = {
  type: 'horizontal' | 'vertical';
  className?: string;
};

type Ad = {
  id: string;
  name: string;
  type: 'image' | 'html';
  placement: 'vertical' | 'horizontal' | 'auto';
  url?: string;
  linkUrl?: string;
  htmlCode?: string;
};

export function AdContainer({ type, className }: AdContainerProps) {
  const { firestore } = useFirebase();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const adsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'advertisements'),
            where('placement', 'in', [type, 'auto'])
          )
        : null,
    [firestore, type]
  );
  
  const { data: ads, isLoading } = useCollection<Ad>(adsQuery);

  useEffect(() => {
    if (!ads || ads.length <= 1) return;

    const rotationInterval = type === 'horizontal' ? 10000 : 15000; // 10s for horizontal, 15s for vertical

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [ads, type]);

  const adToDisplay = ads && ads.length > 0 ? ads[currentAdIndex] : null;
  
  const adStyles = {
    horizontal: {
      container: 'w-full max-w-[728px]',
      inner: 'aspect-[728/90]',
      placeholderHeight: 'h-[90px]',
    },
    vertical: {
      container: 'w-full max-w-[300px]',
      inner: 'aspect-[300/600]',
      placeholderHeight: 'h-[600px]',
    }
  }

  const styles = adStyles[type];

  if (isLoading) {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center bg-muted/50 border border-dashed rounded-lg p-4 space-y-2 text-muted-foreground text-xs animate-pulse',
            styles.container,
            styles.placeholderHeight,
            className
          )}
          >
            <span className="font-semibold">Advertisement</span>
        </div>
    )
  }

  if (!adToDisplay) {
    // Render a placeholder or nothing if no ad is found
    return (
        <div className={cn(
            'flex flex-col items-center justify-center bg-muted/50 border border-dashed rounded-lg p-4 space-y-2 text-muted-foreground text-xs',
            styles.container,
            styles.placeholderHeight,
            className
          )}
          >
            <span className="font-semibold">Advertisement</span>
        </div>
    );
  }

  const renderAdContent = () => {
    if (adToDisplay.type === 'image' && adToDisplay.url) {
      const imageElement = (
        <Image
          src={adToDisplay.url}
          alt={adToDisplay.name}
          fill
          className="object-contain"
        />
      );

      if (adToDisplay.linkUrl) {
        let externalUrl = adToDisplay.linkUrl;
        if (!/^https?:\/\//i.test(externalUrl)) {
          externalUrl = `https://${externalUrl}`;
        }
        return (
          <Link href={externalUrl} target="_blank" rel="noopener noreferrer" className="block relative w-full h-full">
            {imageElement}
          </Link>
        );
      }
      return <div className="relative w-full h-full">{imageElement}</div>;

    } else if (adToDisplay.type === 'html' && adToDisplay.htmlCode) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: adToDisplay.htmlCode }}
          className="w-full h-full"
        />
      );
    }
    return null;
  };


  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-muted/50 border border-dashed rounded-lg p-4 space-y-2 text-muted-foreground text-xs',
        styles.container,
        className
      )}
    >
      <span className="font-semibold">Advertisement</span>
      <div className={cn("relative overflow-hidden bg-background w-full", styles.inner)}>
        {renderAdContent()}
      </div>
    </div>
  );
}
