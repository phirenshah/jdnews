
'use client';
import * as React from 'react';
import { useNewsAggregator } from '@/hooks/use-rss-feed';
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleCard } from '@/components/article-card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Newspaper } from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/categories';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.categoryName as string;
  const { news, loading, error, refresh } = useNewsAggregator();

  const articles = news[categoryName] || [];
  const categoryLabel = CATEGORY_LABELS[categoryName] || categoryName;

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

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="border-l-4 border-primary pl-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-gray-800 uppercase tracking-tight flex items-center gap-3">
          <Newspaper size={32} className="text-primary" />
          {categoryLabel}
        </h1>
      </div>

      <main>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && !articles.length ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : articles.length > 0 ? (
            articles.map((article, idx) => (
              <ArticleCard key={idx} article={article} layout="vertical" />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-muted-foreground">No articles found in this category.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
