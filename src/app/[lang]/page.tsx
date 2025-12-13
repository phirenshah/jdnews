
'use client';
import * as React from 'react';
import { useNewsAggregator } from '@/hooks/use-rss-feed';
import { Skeleton } from '@/components/ui/skeleton';
import { BreakingNewsTicker } from '@/components/breaking-news-ticker';
import { FeaturedStory } from '@/components/featured-story';
import { ArticleCard } from '@/components/article-card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChevronRight, Newspaper } from 'lucide-react';
import { AdContainer } from '@/components/ad-container';
import Link from 'next/link';

const SectionTitle = ({ title, id, href }: { title: string, id: string, href: string }) => (
  <div id={id} className="flex items-center justify-between border-l-4 border-primary pl-3 mb-4 mt-8">
    <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight flex items-center gap-2">
      <Newspaper size={20} className="text-primary" />
      {title}
    </h2>
    <Link href={href} className="text-xs font-semibold text-gray-500 hover:text-primary flex items-center">
      VIEW ALL <ChevronRight size={14} />
    </Link>
  </div>
);

export default function HomePage({
  params,
}: {
  params: Promise<{ lang: 'en' | 'gu' }>;
}) {
  const { lang } = React.use(params);
  const { news, loading, error, refresh } = useNewsAggregator();

  const topStories = news.topStories || [];
  const national = news.national || [];
  const international = news.international || [];

  const allHeadlines = React.useMemo(() => {
    return [...topStories, ...national].slice(0, 10);
  }, [topStories, national]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md text-center">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <AlertTitle className="text-xl font-bold mb-2">Unable to load news</AlertTitle>
          <AlertDescription className="mb-6">{error}</AlertDescription>
          <button onClick={() => refresh()} className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold hover:bg-primary/90 transition">
            Try Again
          </button>
        </Alert>
      </div>
    );
  }

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
      <div className="lg:col-span-4 space-y-2 bg-card p-4 rounded-md border">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex gap-3 py-2 border-b last:border-0">
            <div className='flex-1 space-y-2'>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <Skeleton className="h-16 w-20 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategorySection = (title: string, articles: any[], categoryId: string) => {
    if (loading && !articles.length) {
      return (
        <section id={categoryId}>
          <SectionTitle title={title} id={categoryId} href={`/${lang}/category/${categoryId}`} />
          <div className="bg-card p-4 rounded-md shadow-sm border border-border/60">
            <Skeleton className="h-48" />
          </div>
        </section>
      )
    }
    if (!articles || articles.length === 0) return null;
    return (
      <section id={categoryId}>
        <SectionTitle title={title} id={categoryId} href={`/${lang}/category/${categoryId}`} />
        <div className="bg-card p-4 rounded-md shadow-sm border border-border/60">
            <div className="mb-4 border-b border-border pb-4">
              {articles[0] && <ArticleCard article={articles[0]} layout="vertical" />}
            </div>
            <div className="space-y-1">
              {articles.slice(1, 4).map((item, idx) => <ArticleCard key={idx} article={item} layout="compact" />)}
            </div>
        </div>
      </section>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {loading && !allHeadlines.length ? <Skeleton className="h-10 w-full mb-4" /> : <BreakingNewsTicker articles={allHeadlines} />}
      
      <main className="mt-6">
        <section id="topStories" className="mb-10">
          {loading && !topStories.length ? renderSkeleton() : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                {topStories[0] && <FeaturedStory article={topStories[0]} />}
              </div>
              <div className="lg:col-span-4 flex flex-col h-full bg-card rounded-md shadow-sm border border-border/60 overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b font-bold text-sm text-primary uppercase flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  Latest Updates
                </div>
                <div className="overflow-y-auto">
                  {topStories.slice(1, 8).map((article, idx) => (
                    <div key={idx} className="px-4 hover:bg-muted/50 transition-colors">
                      <ArticleCard article={article} layout="compact" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <AdContainer type="horizontal" className="w-full justify-center my-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {renderCategorySection("National", national, 'national')}
          {renderCategorySection("International", international, 'international')}
        </div>
        
      </main>
    </div>
  );
}
