'use client';
import * as React from 'react';
import { useRssFeed } from '@/hooks/use-rss-feed';
import { getFeedUrl } from '@/lib/categories';
import { Skeleton } from '@/components/ui/skeleton';
import { BreakingNewsTicker } from '@/components/breaking-news-ticker';
import { FeaturedStory } from '@/components/featured-story';
import { ArticleCard } from '@/components/article-card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Frown, Newspaper } from 'lucide-react';
import { AdContainer } from '@/components/ad-container';

export default function HomePage({
  params,
}: {
  params: Promise<{ lang: 'en' | 'gu' }>;
}) {
  const { lang } = React.use(params);
  const feedUrl = getFeedUrl('Top Stories', lang);
  const {
    articles,
    isLoading,
    error,
  } = useRssFeed(feedUrl);

  const heroArticle = articles.length > 0 ? articles[0] : null;
  const topSubArticles = articles.slice(1, 5);
  const secondaryArticles = articles.slice(5, 13);
  const breakingNews = articles.slice(0, 10);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6">
      {isLoading && <Skeleton className="h-10 w-full mb-4" />}
      {!isLoading && !error && breakingNews.length > 0 && (
        <BreakingNewsTicker articles={breakingNews} />
      )}

      <main className="mt-6">
        {isLoading && renderSkeleton()}
        {error && (
          <Alert variant="destructive">
            <Frown className="h-4 w-4" />
            <AlertTitle>Error Fetching Top Stories</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && heroArticle && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FeaturedStory article={heroArticle} />
            </div>
            <div className="space-y-4">
              {topSubArticles.map((article) => (
                <ArticleCard
                  key={article.link}
                  article={article}
                  layout="horizontal"
                  showImage={true}
                />
              ))}
            </div>
          </div>
        )}
      </main>

       <div className="my-8 flex w-full justify-center">
        <AdContainer type="horizontal" className="w-full justify-center" />
      </div>

      {!isLoading && !error && secondaryArticles.length > 0 && (
        <section className="mt-8">
           <h2 className="text-2xl font-bold font-headline mb-4 border-b-2 border-primary pb-2 flex items-center gap-2">
            <Newspaper />
            More News
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {secondaryArticles.map((article) => (
               <ArticleCard key={article.link} article={article} layout="vertical" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
