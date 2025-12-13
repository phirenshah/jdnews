'use client';
import { RssArticle } from '@/lib/rss';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { gu } from 'date-fns/locale';
import Image from 'next/image';
import { ChevronRight, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: RssArticle;
  layout?: 'horizontal' | 'vertical' | 'compact';
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

  if (layout === 'compact') {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group flex gap-3 py-3 border-b border-gray-100 last:border-0 items-start',
          className
        )}
      >
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h4>
          <div className="flex items-center text-[10px] text-gray-400 mt-1 gap-2">
            <Clock size={10} /> {timeAgo}
          </div>
        </div>
        {showImage && article.imageUrl && (
          <div className="w-20 h-16 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden relative">
            <Image
              src={article.imageUrl}
              alt=""
              fill
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
              sizes="80px"
            />
          </div>
        )}
      </a>
    );
  }

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group block bg-card h-full flex flex-col',
        layout === 'horizontal' ? 'flex-row items-center gap-3 p-3 rounded-md hover:bg-muted/50' : 'p-3 rounded-md shadow-sm border border-border/60 hover:shadow-lg transition-shadow',
        className
      )}
    >
      {showImage && article.imageUrl && (
        <div
          className={cn(
            'relative overflow-hidden bg-muted rounded-sm',
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
           {layout === 'vertical' && (
             <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                {timeAgo}
            </div>
           )}
        </div>
      )}
      <div className={cn("flex-1 flex flex-col", layout === 'vertical' ? 'pt-3' : '')}>
        <h3
          className={cn(
            'font-bold group-hover:text-primary transition-colors',
            layout === 'horizontal'
              ? 'text-sm line-clamp-3'
              : 'text-base font-headline leading-snug mb-2 line-clamp-3'
          )}
        >
          {article.title}
        </h3>
        {layout === 'horizontal' && <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>}
        {layout === 'vertical' && (
            <>
                <p className="text-muted-foreground text-xs line-clamp-2 mb-3 flex-1" dangerouslySetInnerHTML={{ __html: article.description }}/>
                <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-2">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Read Full Story</span>
                    <ChevronRight size={14} className="text-primary" />
                </div>
            </>
        )}
      </div>
    </a>
  );
}
