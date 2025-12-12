'use client';
import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore } from '@/firebase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, Newspaper } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const QrCodeSvg = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H30V30H0V0ZM10 10H20V20H10V10Z"
        fill="currentColor"
      />
      <path d="M40 0H50V10H40V0Z" fill="currentColor" />
      <path d="M60 0H70V10H60V0Z" fill="currentColor" />
      <path d="M40 20H50V30H40V20Z" fill="currentColor" />
      <path d="M90 20H100V30H90V20Z" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M70 0H100V30H70V0ZM80 10H90V20H80V10Z"
        fill="currentColor"
      />
      <path d="M0 40H10V50H0V40Z" fill="currentColor" />
      <path d="M20 40H30V50H20V40Z" fill="currentColor" />
      <path d="M40 40H50V50H40V40Z" fill="currentColor" />
      <path d="M60 40H70V50H60V40Z" fill="currentColor" />
      <path d="M80 40H90V50H80V40Z" fill="currentColor" />
      <path d="M0 60H10V70H0V60Z" fill="currentColor" />
      <path d="M40 60H50V70H40V60Z" fill="currentColor" />
      <path d="M70 60H80V70H70V60Z" fill="currentColor" />
      <path d="M90 60H100V70H90V60Z" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 70H30V100H0V70ZM10 80H20V90H10V80Z"
        fill="currentColor"
      />
      <path d="M40 80H50V90H40V80Z" fill="currentColor" />
      <path d="M60 80H80V90H60V80Z" fill="currentColor" />
      <path d="M90 80H100V90H90V80Z" fill="currentColor" />
    </svg>
  );

export default function ReporterProfilePage({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const authorRef = useMemo(() => doc(firestore, 'authors', params.id), [firestore, params.id]);
    const { data: author, isLoading } = useDoc(authorRef);
    
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!author) {
        notFound();
    }

    return (
        <div className="bg-muted/20 min-h-screen py-12">
            <div className="container mx-auto max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card p-6 rounded-lg shadow-md text-center">
                             <Avatar className="w-40 h-40 mx-auto mb-4 border-4 border-background ring-2 ring-primary">
                                <AvatarImage src={author.profilePictureUrl} alt={`${author.firstName} ${author.lastName}`} />
                                <AvatarFallback className="text-5xl">{author.firstName.charAt(0)}{author.lastName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h1 className="text-3xl font-bold font-headline">{author.firstName} {author.lastName}</h1>
                            <p className="text-primary font-medium text-lg">{author.title}</p>
                            {author.verified && (
                                <Badge variant="default" className="mt-2 bg-green-500 hover:bg-green-600">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Verified Reporter
                                </Badge>
                            )}
                        </div>
                        <div className="bg-card p-6 rounded-lg shadow-md">
                            <h3 className="font-bold text-lg mb-4 text-center font-headline">Digital Press Card</h3>
                            <div className="w-48 h-48 mx-auto text-foreground">
                                <QrCodeSvg />
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-2">Scan to verify authenticity</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-card p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold font-headline mb-4">About {author.firstName}</h2>
                        <p className="text-muted-foreground leading-relaxed">{author.bio}</p>
                        
                        <Separator className="my-8" />

                        <div className="space-y-4">
                             <div className="flex items-center">
                                <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                                <a href={`mailto:${author.email}`} className="text-primary hover:underline">{author.email}</a>
                            </div>
                            <div className="flex items-center">
                                <Newspaper className="w-5 h-5 mr-3 text-muted-foreground" />
                                <span>{author.articlesPublished} Articles Published</span>
                            </div>
                             <div className="flex items-center">
                                <span className="w-5 h-5 mr-3 text-muted-foreground font-bold">#</span>
                                <span>Joined on {author.joinedDate}</span>
                            </div>
                        </div>

                         <Separator className="my-8" />
                         <h2 className="text-2xl font-bold font-headline mb-4">Recent Articles</h2>
                         {/* Placeholder for recent articles */}
                         <p className="text-muted-foreground">No articles published yet.</p>

                    </div>
                </div>
            </div>
        </div>
    )
}
