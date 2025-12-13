'use client';
import { RssArticle } from '@/lib/rss';
import { Volume2 } from 'lucide-react';
import Link from 'next/link';

export function BreakingNewsTicker({ articles }: { articles: RssArticle[] }) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center bg-primary text-primary-foreground h-10 overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-center bg-red-700 px-3 h-full">
        <Volume2 className="h-5 w-5" />
        <span className="ml-2 font-bold text-sm hidden sm:inline">BREAKING</span>
      </div>
      <div className="ticker-wrap flex-grow">
        <div className="ticker">
          {articles.map((article, index) => (
            <a
              key={article.link + index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mx-6 text-sm whitespace-nowrap hover:underline"
            >
              {article.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
