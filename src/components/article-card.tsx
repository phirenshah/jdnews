
'use client';
import { RssArticle, formatDate } from '@/lib/rss';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ChevronRight, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: RssArticle;
  layout?: 'vertical' | 'compact';
  className?: string;
}

export function ArticleCard({
  article,
  layout = 'vertical',
  className,
}: ArticleCardProps) {
  if (!article) return null;

  const timeAgo = article.pubDate ? formatDate(article.pubDate) : '';

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
        {article.imageUrl && (
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

  // Vertical layout (default)
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('group block bg-card h-full flex flex-col', className)}
    >
      <div className="relative aspect-video overflow-hidden rounded-sm bg-gray-100">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
            <span className="font-bold text-xl">GS</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
           {timeAgo}
        </div>
      </div>
      <div className="pt-3 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary mb-2 line-clamp-3">
          {article.title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3 flex-1">{article.description}</p>
        <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-2">
           <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Read Full Story</span>
           <ChevronRight size={14} className="text-primary" />
        </div>
      </div>
    </a>
  );
}
