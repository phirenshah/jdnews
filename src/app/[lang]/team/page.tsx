'use client';
import { React, use } from 'react';
import { placeholderReporters } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const QrCodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M16 21v-3a2 2 0 0 0-2-2h-3" />
    <path d="M3 8h3a2 2 0 0 0 2-2V3" />
    <path d="M8 3v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const ReporterCardSkeleton = () => (
    <Card className="text-center shadow-lg">
        <CardHeader className="relative">
            <Skeleton className="w-32 h-32 mx-auto rounded-full" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Separator className="my-4" />
            <div className="flex justify-around items-center text-sm text-muted-foreground">
                <QrCodeIcon className="h-8 w-8 text-foreground/50" />
                <Skeleton className="h-4 w-16" />
            </div>
        </CardContent>
    </Card>
);

export default function ReportersPage({ params }: { params: { lang: 'en' | 'gu' } }) {
  const { lang } = use(params);
  const title = lang === 'en' ? 'Our Team' : 'અમારી ટીમ';
  const subtitle = lang === 'en' ? 'Meet the team behind the news' : 'સમાચાર પાછળની ટીમને મળો';
  const firestore = useFirestore();

  const authorsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'authors') : null),
    [firestore]
  );
  const { data: authors, isLoading } = useCollection(authorsCollection);


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">{title}</h1>
        <p className="text-lg text-muted-foreground mt-2">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {isLoading && (
            <>
                <ReporterCardSkeleton />
                <ReporterCardSkeleton />
                <ReporterCardSkeleton />
                <ReporterCardSkeleton />
            </>
        )}
        {!isLoading && authors?.map((reporter: any) => {
          return (
            <Card key={reporter.id} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
             <Link href={`/${lang}/team/${reporter.id}`}>
              <CardHeader className="relative">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-background ring-2 ring-primary">
                  {reporter.profilePictureUrl && (
                    <Image
                      src={reporter.profilePictureUrl}
                      alt={`${reporter.firstName} ${reporter.lastName}`}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  )}
                </div>
                 {reporter.verified && (
                    <Badge variant="default" className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </Badge>
                  )}
              </CardHeader>
              <CardContent>
                <h2 className="text-xl font-bold font-headline">{reporter.firstName} {reporter.lastName}</h2>
                <p className="text-primary font-medium">{reporter.title}</p>
                <Separator className="my-4" />
                <div className="flex justify-around items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                        <QrCodeIcon className="h-8 w-8 text-foreground" />
                        <span>View Card</span>
                    </div>
                </div>
              </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
