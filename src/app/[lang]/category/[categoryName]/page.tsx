
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { Article } from '@/lib/definitions';
import { useArticles } from '@/contexts/ArticlesContext';
import { useEffect, useState } from 'react';
import * as React from 'react';

type StrippedArticle = Omit<Article, 'authorId' | 'contentEnglish' | 'contentGujarati'>;

export default function CategoryPage({ params }: { params: Promise<{ lang: 'en' | 'gu', categoryName: string }> }) {
  const { lang, categoryName } = React.use(params);
  const { articles: allArticles } = useArticles();
  const [filteredArticles, setFilteredArticles] = useState<StrippedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Capitalize first letter for query
  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();

  useEffect(() => {
    setIsLoading(true);
    if (allArticles) {
      const filtered = allArticles.filter(
        (article: StrippedArticle) => article.category === formattedCategory
      );
      setFilteredArticles(filtered);
    }
    setIsLoading(false);
  }, [formattedCategory, allArticles]);
  
  const title = lang === 'en' ? formattedCategory : formattedCategory; // Add Gujarati translations if available

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }
  
  if (!isLoading && !filteredArticles?.length) {
      return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold font-headline mb-8">{title}</h1>
            <p>No articles found in this category yet.</p>
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline mb-8">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles?.map((article) => {
          const articleTitle = lang === 'en' ? article.titleEnglish : article.titleGujarati;
          const articleExcerpt = lang === 'en' ? article.excerptEnglish : article.excerptGujarati;

          return (
            <Card key={article.id} className="flex flex-col shadow-md halo-effect">
              <Link href={`/${lang}/article/${article.slug}`} className="flex flex-col flex-grow">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt={articleTitle}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : <div className="w-full h-full bg-muted"></div>}
                </div>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <h3 className="font-headline text-xl font-bold mb-2 flex-grow">
                    {articleTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {articleExcerpt}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(article.publicationDate).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
