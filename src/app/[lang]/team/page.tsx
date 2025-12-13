
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUserRole } from '@/hooks/use-user-role';
import { PressCardFront } from '@/components/press-card-front';
import { Reporter } from '@/lib/definitions';
import { Separator } from '@/components/ui/separator';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';

const contentCreatorRoles = ['reporter', 'editor', 'director'];

export default function ReportersPage() {
  const params = useParams();
  const lang = params.lang as 'en' | 'gu';
  const { userProfile, user, role } = useUserRole();
  const { firestore } = useFirebase();

  // Query to get only authors that have a content creator role.
  const authorsCollection = useMemoFirebase(
    () => (firestore ? 
        query(
            collection(firestore, 'authors'),
            where('title', 'in', ['Reporter', 'Editor', 'Director', 'Senior Political Correspondent', 'Technology Editor', 'Sports Journalist', 'Investigative Reporter']) // Match against titles
        ) 
        : null),
    [firestore]
  );
  const { data: authors, isLoading: areAuthorsLoading } = useCollection<Reporter>(authorsCollection);
  
  const selfReporterData = useMemo(() => {
    if (!user?.email || !authors) return null;
    return authors.find(
      (r) => r.contact.toLowerCase() === user.email?.toLowerCase()
    );
  }, [user, authors]);

  const title = lang === 'en' ? 'Our Team' : 'અમારી ટીમ';
  const subtitle =
    lang === 'en'
      ? 'Meet the team behind the news'
      : 'સમાચાર પાછળની ટીમને મળો';

  const canViewOwnCard = role && contentCreatorRoles.includes(role);

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        {canViewOwnCard && selfReporterData && userProfile && (
          <section className="mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">My Press Card</h2>
            <div className="flex justify-center">
               <PressCardFront reporter={selfReporterData as Reporter} lang={lang} />
            </div>
             <Separator className="my-16" />
          </section>
        )}

        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">{subtitle}</p>
        </div>

        {areAuthorsLoading ? (
            <div className="text-center">Loading team...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {authors?.map((reporter) => {
                return (
                <Link key={reporter.id} href={`/${lang}/reporters/${reporter.id}`} className="group">
                    <Card
                    className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                    >
                    <CardHeader className="relative p-4">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-background ring-2 ring-primary">
                            {reporter.profilePictureUrl ? (
                                <Image
                                src={reporter.profilePictureUrl}
                                alt={reporter.name}
                                width={128}
                                height={128}
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground">
                                {reporter.name.charAt(0)}
                                </div>
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
        )}
      </div>
    </>
  );
}
