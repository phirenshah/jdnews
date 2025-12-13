'use client';
import { RssArticle } from '@/lib/rss';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { gu } from 'date-fns/locale';
import Image from 'next/image';

interface ArticleCardProps {
  article: RssArticle;
  layout?: 'horizontal' | 'vertical';
  showImage?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  layout = 'vertical',
  showImage = true,
  className,
}: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.pubDate), {
    addSuffix: true,
    locale: gu,
  });

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group block',
        layout === 'horizontal' ? 'flex items-center gap-3' : 'flex flex-col',
        className
      )}
    >
      {showImage && article.imageUrl && (
        <div
          className={cn(
            'relative overflow-hidden bg-muted rounded',
            layout === 'horizontal'
              ? 'w-24 h-16 flex-shrink-0'
              : 'w-full aspect-video'
          )}
        >
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex-1">
        <h3
          className={cn(
            'font-bold group-hover:text-primary transition-colors',
            layout === 'horizontal'
              ? 'text-sm line-clamp-3'
              : 'text-lg mt-2 font-headline line-clamp-3'
          )}
        >
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
      </div>
    </a>
  );
}
