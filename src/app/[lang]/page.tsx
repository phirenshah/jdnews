
import Image from 'next/image';
import Link from 'next/link';
import {
  placeholderArticles
} from '@/lib/placeholder-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdContainer } from '@/components/ad-container';
import { Separator } from '@/components/ui/separator';

export default function HomePage({ params: { lang } }: { params: { lang: 'en' | 'gu' } }) {
  const heroArticle = placeholderArticles[0];
  const secondaryArticles = placeholderArticles.slice(1, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Hero Section */}
          <Card className="overflow-hidden shadow-lg halo-effect">
            <Link href={`/${lang}/article/${heroArticle.slug}`}>
              <div className="relative h-96 w-full">
                {heroArticle.imageUrl && (
                  <Image
                    src={heroArticle.imageUrl}
                    alt={heroArticle.titleEnglish}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    priority
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-3xl lg:text-4xl leading-tight">
                  {lang === 'en' ? heroArticle.titleEnglish : heroArticle.titleGujarati}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  {lang === 'en' ? heroArticle.excerptEnglish : heroArticle.excerptGujarati}
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Secondary Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {secondaryArticles.map((article) => {
              return (
                <Card key={article.id} className="flex flex-col shadow-md halo-effect">
                  <Link href={`/${lang}/article/${article.slug}`} className="flex flex-col flex-grow">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      {article.imageUrl && (
                        <Image
                          src={article.imageUrl}
                          alt={lang === 'en' ? article.titleEnglish : article.titleGujarati}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-headline text-xl font-bold mb-2 flex-grow">
                        {lang === 'en' ? article.titleEnglish : article.titleGujarati}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lang === 'en' ? article.excerptEnglish : article.excerptGujarati}
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
          
          <Card className="halo-effect">
            <CardHeader>
              <CardTitle className="font-headline text-xl">From Other Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries({}).map(([source, items]: [string, any[]], index) => (
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
                  {index < Object.keys({}).length - 1 && <Separator className="mt-4"/>}
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </main>

      <div className="my-12 flex w-full justify-center">
        <AdContainer type="horizontal" className="w-full justify-center" />
      </div>
    </div>
  );
}
