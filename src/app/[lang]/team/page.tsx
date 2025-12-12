'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { placeholderReporters } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function ReportersPage({ params }: { params: { lang: 'en' | 'gu' } }) {
  const { lang } = params;

  const title = lang === 'en' ? 'Our Team' : 'અમારી ટીમ';
  const subtitle =
    lang === 'en'
      ? 'Meet the team behind the news'
      : 'સમાચાર પાછળની ટીમને મળો';

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {placeholderReporters.map((reporter) => {
            const reporterImage = PlaceHolderImages.find(
              (img) => img.id === reporter.imageId
            );
            return (
              <Link key={reporter.id} href={`/${lang}/reporters/${reporter.id}`} className="group">
                <Card
                  className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                >
                  <CardHeader className="relative p-4">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-background ring-2 ring-primary">
                      {reporterImage && (
                        <Image
                          src={reporterImage.imageUrl}
                          alt={reporter.name}
                          width={128}
                          height={128}
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    </div>
                    {reporter.verified && (
                      <Badge
                        variant="default"
                        className="absolute top-2 right-2 bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 flex-grow flex flex-col justify-center">
                    <h2 className="text-xl font-bold font-headline group-hover:underline">
                        {reporter.name}
                    </h2>
                    <p className="text-primary font-medium">{reporter.title}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
