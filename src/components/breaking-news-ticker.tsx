'use client';
import { RssArticle } from '@/lib/rss';

export function BreakingNewsTicker({ articles }: { articles: RssArticle[] }) {
  if (!articles || articles.length === 0) {
    return null;
  }
  
  const tickerContent = articles.map((article, index) => (
    <a
      key={article.link + index}
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mx-6 text-sm whitespace-nowrap hover:underline"
    >
      <span className="w-1.5 h-1.5 bg-white rounded-full inline-block mr-2 align-middle"></span>
      {article.title}
    </a>
  ));

  return (
    <div className="bg-red-700 text-white text-sm flex items-center overflow-hidden h-10 shadow-md relative z-10">
      <div className="bg-red-800 px-4 h-full flex items-center font-black uppercase tracking-wider text-xs whitespace-nowrap shadow-[4px_0_10px_rgba(0,0,0,0.2)] z-20">
        Breaking News
      </div>
      <div className="ticker-wrap flex-grow h-full flex items-center">
        <div className="ticker">
          {tickerContent}
          {tickerContent} 
        </div>
      </div>
    </div>
  );
}
