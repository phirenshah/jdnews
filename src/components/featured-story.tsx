'use client';
import { RssArticle } from '@/lib/rss';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { gu } from 'date-fns/locale';
import { Clock, Share2 } from 'lucide-react';

export function FeaturedStory({ article }: { article: RssArticle }) {
    
  const timeAgo = formatDistanceToNow(new Date(article.pubDate), {
    addSuffix: true,
    locale: gu
  });

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({ title: article.title, url: article.link });
    }
  };

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative h-full min-h-[400px] overflow-hidden rounded-md shadow-sm"
    >
        {article.imageUrl ? (
            <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
            />
        ) : (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-600">
                <span className="text-6xl font-black opacity-20">NEWS</span>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full text-white">
            <span className="inline-block px-2 py-1 bg-red-600 text-xs font-bold uppercase mb-2">Top Story</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline leading-tight mb-3 group-hover:text-red-100 transition-colors">
            {article.title}
            </h1>
            <p className="text-gray-300 text-sm line-clamp-2 mb-4 hidden md:block" dangerouslySetInnerHTML={{ __html: article.description }} />
            <div className="flex items-center text-xs text-gray-300 gap-4">
                <span className="flex items-center gap-1.5"><Clock size={12} /> {timeAgo}</span>
                <button onClick={handleShare} className="hover:text-white transition-colors flex items-center gap-1.5"><Share2 size={14} /></button>
            </div>
        </div>
    </a>
  );
}
