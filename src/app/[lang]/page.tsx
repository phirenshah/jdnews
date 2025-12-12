import Image from 'next/image';
import Link from 'next/link';
import {
  placeholderArticles,
  rssFeeds,
} from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdContainer } from '@/components/ad-container';
import { Separator } from '@/components/ui/separator';

export default function HomePage({ params: { lang } }: { params: { lang: 'en' | 'gu' } }) {
  const heroArticle = placeholderArticles[0];
  const secondaryArticles = placeholderArticles.slice(1, 5);

  const heroImage = PlaceHolderImages.find(
    (img) => img.id === heroArticle.imageId
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Hero Section */}
          <Card className="overflow-hidden shadow-lg">
            <Link href={`/${lang}/article/${heroArticle.slug}`}>
              <div className="relative h-96 w-full">
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroArticle.title[lang]}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    data-ai-hint={heroImage.imageHint}
                    priority
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-3xl lg:text-4xl leading-tight">
                  {heroArticle.title[lang]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  {heroArticle.excerpt[lang]}
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Secondary Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {secondaryArticles.map((article) => {
              const articleImage = PlaceHolderImages.find(
                (img) => img.id === article.imageId
              );
              return (
                <Card key={article.id} className="flex flex-col shadow-md">
                  <Link href={`/${lang}/article/${article.slug}`} className="flex flex-col flex-grow">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      {articleImage && (
                        <Image
                          src={articleImage.imageUrl}
                          alt={article.title[lang]}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          data-ai-hint={articleImage.imageHint}
                        />
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-headline text-xl font-bold mb-2 flex-grow">
                        {article.title[lang]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {article.excerpt[lang]}
                      </p>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-8">
          <AdContainer type="vertical" />
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">From Other Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(rssFeeds).map(([source, items], index) => (
                <div key={source}>
                  <h4 className="font-bold mb-2">{source}</h4>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item.title}>
                        <Link href={item.link} className="text-sm hover:text-primary hover:underline">
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {index < Object.keys(rssFeeds).length - 1 && <Separator className="mt-4"/>}
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </main>

      <div className="my-12 flex justify-center">
        <AdContainer type="horizontal" />
      </div>
    </div>
  );
}
