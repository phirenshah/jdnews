'use client';
import * as React from 'react';
import { notFound } from 'next/navigation';
import { useRssFeed } from '@/hooks/use-rss-feed';
import { getFeedUrl, sections } from '@/lib/categories';
import { ArticleCard } from '@/components/article-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';

export default function CategoryPage({
  params,
}: {
  params: Promise<{ lang: 'en' | 'gu'; categoryName: string }>;
}) {
  const resolvedParams = React.use(params);
  const { lang, categoryName } = resolvedParams;
  
  const categoryInfo = sections.find(
    (s) => s.href === `/category/${categoryName}`
  );

  if (!categoryInfo) {
    notFound();
  }

  const feedUrl = getFeedUrl(categoryInfo.name, lang);
  const { articles, isLoading, error } = useRssFeed(feedUrl);

  const title = lang === 'en' ? categoryInfo.name : categoryInfo.name;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-6 border-b-2 border-primary pb-2">
        {title}
      </h1>
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <Frown className="h-4 w-4" />
          <AlertTitle>Error Fetching News</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!isLoading && !error && articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.link} article={article} layout="vertical" />
          ))}
        </div>
      ) : (
        !isLoading && !error && <p>No articles found for this category.</p>
      )}
    </div>
  );
}
