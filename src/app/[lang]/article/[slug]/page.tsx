
'use client';

import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where, DocumentData } from 'firebase/firestore';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, Link as LinkIcon, MessageCircle, User, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { AdContainer } from '@/components/ad-container';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Reporter } from '@/lib/definitions';

type Article = {
    id: string;
    titleEnglish: string;
    titleGujarati: string;
    contentEnglish: string;
    contentGujarati: string;
    excerptEnglish: string;
    excerptGujarati: string;
    imageUrl: string;
    authorId: string;
    publicationDate: { seconds: number; nanoseconds: number; };
    category: string;
    slug: string;
};


function AuthorDisplay({ authorId }: { authorId: string }) {    
    const { firestore } = useFirebase();
    const authorRef = useMemoFirebase(() => (firestore && authorId ? doc(firestore, 'authors', authorId) : null), [firestore, authorId]);
    const { data: author, isLoading } = useDoc<Reporter>(authorRef);

    if (isLoading) return <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />;
    if (!author) return <p>Unknown Author</p>;

    return (
        <div className="flex items-center space-x-4">
            <Avatar>
                <AvatarImage src={author.profilePictureUrl} alt={author.name} />
                <AvatarFallback>{author.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{author.name}</p>
            </div>
        </div>
    );
}


export default function ArticlePage() {
    const params = useParams();
    const lang = params.lang as 'en' | 'gu';
    const slug = params.slug as string;

    const { firestore } = useFirebase();

    const articlesQuery = useMemoFirebase(
        () => firestore && slug ? query(collection(firestore, 'articles'), where('slug', '==', slug)) : null,
        [firestore, slug]
    );

    const { data: articles, isLoading, error } = useCollection<Article>(articlesQuery);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        );
    }
    
    if (error) {
        console.error(error);
        return <div className="container py-8 text-center">Error loading article. Please check your Firestore security rules and index configuration.</div>
    }

    const article = articles?.[0];
    
    if (!isLoading && !article) {
        return notFound();
    }
    
    const articleTitle = lang === 'en' ? article.titleEnglish : article.titleGujarati;
    const articleExcerpt = lang === 'en' ? article.excerptEnglish : article.excerptGujarati;
    const articleContent = lang === 'en' ? article.contentEnglish : article.contentGujarati;


    return (
        <div className="bg-background">
            <article>
                <header className="container mx-auto px-4 py-8 md:py-16 text-center">
                    <p className="text-primary font-semibold mb-2">{article.category}</p>
                    <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-4">
                        {articleTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                        {articleExcerpt}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        {article.authorId && <AuthorDisplay authorId={article.authorId} />}
                        <p className="text-sm text-muted-foreground">
                        Published on {new Date(article.publicationDate.seconds * 1000).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </header>

                {article.imageUrl && (
                    <div className="relative h-[300px] md:h-[500px] bg-muted">
                        <Image
                            src={article.imageUrl}
                            alt={articleTitle}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="container mx-auto px-4 my-8 md:my-12">
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 md:col-span-1 lg:col-span-2 flex md:flex-col items-center md:items-start justify-center md:justify-start space-x-4 md:space-x-0 md:space-y-4 text-muted-foreground">
                            <p className="text-sm font-semibold hidden md:block">SHARE</p>
                            <Button variant="ghost" size="icon"><Twitter className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="icon"><Facebook className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="icon"><Linkedin className="h-5 w-5" /></Button>
                            <Button variant="ghost" size="icon"><LinkIcon className="h-5 w-5" /></Button>
                        </div>

                        <div className="col-span-12 md:col-span-8 lg:col-span-7 prose prose-lg dark:prose-invert max-w-full font-body">
                           {articleContent.split('\\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                           ))}
                        </div>

                        <aside className="col-span-12 md:col-span-3 lg:col-span-3 space-y-8">
                            <AdContainer type="vertical" className="hidden md:flex"/>
                        </aside>
                    </div>
                </div>

                <Separator />

                {/* Related Stories: This can be implemented later by fetching related articles */}
                {/* <div className="container mx-auto px-4 py-12">
                    <h2 className="font-headline text-3xl font-bold mb-6">Related Stories</h2>
                    ...
                </div> */}

                <Separator />

                {/* Comments Section */}
                <div className="container mx-auto px-4 py-12 max-w-3xl">
                    <h2 className="font-headline text-3xl font-bold mb-6 flex items-center">
                        <MessageCircle className="mr-3 h-7 w-7" />
                        Comments
                    </h2>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex space-x-4">
                                <Avatar>
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                                <div className="w-full">
                                <Textarea placeholder="Add a comment..." />
                                <Button className="mt-2">Post Comment</Button>
                                </div>
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-6">
                                {/* Example Comment */}
                                <div className="flex space-x-4">
                                    <Avatar>
                                        <AvatarFallback>A</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">Anjali</p>
                                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                                        <p className="mt-1">This is a great analysis. Thank you for the detailed report!</p>
                                    </div>
                                </div>
                                {/* Example Comment */}
                                <div className="flex space-x-4">
                                    <Avatar>
                                        <AvatarFallback>R</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">Ravi</p>
                                        <p className="text-sm text-muted-foreground">1 day ago</p>
                                        <p className="mt-1">I have a different perspective on this issue. The author should consider...</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </article>
        </div>
    );
}

