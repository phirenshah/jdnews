'use client';
import { RssArticle } from '@/lib/rss';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { gu } from 'date-fns/locale';

export function FeaturedStory({ article }: { article: RssArticle }) {
    
  const timeAgo = formatDistanceToNow(new Date(article.pubDate), {
    addSuffix: true,
    locale: gu
  });

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                No Image
            </div>
        )}
      </div>
      <div className="mt-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline leading-tight group-hover:text-primary transition-colors">
          {article.title}
        </h1>
        <p className="mt-2 text-md text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: article.description }} />
        <p className="text-xs text-muted-foreground mt-2">{timeAgo}</p>
      </div>
    </a>
  );
}
