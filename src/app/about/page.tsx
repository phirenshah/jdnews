
'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Award, Target, Users, Newspaper, Loader2 } from 'lucide-react';
import * as React from 'react';
import type { Reporter } from '@/lib/definitions';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Link from 'next/link';

export default function AboutPage() {
  const { firestore } = useFirebase();

  const authorsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'authors') : null),
    [firestore]
  );
  const { data: authors, isLoading: areAuthorsLoading } = useCollection<Reporter>(authorsCollection);

  const t = {
    title: 'About JD News',
    subtitle: 'Transparency, Truth, and Tenacity in Journalism.',
    missionTitle: 'Our Mission',
    missionText: 'To deliver unbiased, fact-checked news that empowers citizens to make informed decisions. We are committed to journalistic integrity and holding power accountable.',
    valuesTitle: 'Our Core Values',
    values: [
      { icon: Award, title: 'Integrity', text: 'Upholding the highest standards of honesty and ethical conduct.' },
      { icon: Target, title: 'Accuracy', text: 'Ensuring every story is thoroughly researched and factually correct.' },
      { icon: Users, title: 'Community', text: 'Serving our readers by giving voice to diverse perspectives.' },
      { icon: Newspaper, title: 'Independence', text: 'Remaining free from political, corporate, or any external influence.' },
    ],
    teamTitle: 'Meet the Team',
    teamText: 'The dedicated individuals bringing you the news, day in and day out.',
    viewProfile: 'View Profile',
  };
  
  const aboutHeroImage = PlaceHolderImages.find((img) => img.id === 'about-hero');
  const aboutContentImage = PlaceHolderImages.find((img) => img.id === 'about-content');

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-80 bg-muted">
        {aboutHeroImage && (
            <Image
            src={aboutHeroImage.imageUrl}
            alt="Newsroom"
            fill
            className="object-cover"
            data-ai-hint={aboutHeroImage.imageHint}
            priority
            />
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="font-headline text-5xl md:text-7xl font-bold">{t.title}</h1>
            <p className="mt-4 text-lg md:text-xl">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-16">
        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="font-headline text-4xl font-bold text-primary">{t.missionTitle}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{t.missionText}</p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            {aboutContentImage && (
                <Image
                src={aboutContentImage.imageUrl}
                alt="Journalist at work"
                width={600}
                height={400}
                className="object-cover"
                data-ai-hint={aboutContentImage.imageHint}
                />
            )}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Core Values Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold">{t.valuesTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-lg shadow-sm halo-effect">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-headline text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Meet the Team Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold">{t.teamTitle}</h2>
            <p className="text-lg text-muted-foreground mt-2">{t.teamText}</p>
          </div>
          {areAuthorsLoading ? (
            <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                {authors?.filter(author => author.verified).map((reporter) => (
                    <Link key={reporter.id} href={`/reporters/${reporter.id}`} className="group">
                        <Card className="text-center border-0 shadow-none bg-transparent">
                        <CardHeader className="p-0">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden relative border-2 border-primary/50">
                            {reporter.profilePictureUrl ? (
                                <Image
                                src={reporter.profilePictureUrl}
                                alt={reporter.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="128px"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground">
                                {reporter.name.charAt(0)}
                                </div>
                            )}
                            </div>
                        </CardHeader>
                        <CardContent className="mt-4">
                            <h3 className="text-lg font-bold font-headline group-hover:text-primary">{reporter.name}</h3>
                            <p className="text-primary text-sm font-medium">{reporter.title}</p>
                        </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
