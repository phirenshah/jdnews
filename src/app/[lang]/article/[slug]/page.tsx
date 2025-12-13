
'use client';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, Link as LinkIcon, MessageCircle, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AdContainer } from '@/components/ad-container';
import type { Reporter } from '@/lib/definitions';
import { placeholderArticles, placeholderReporters } from '@/lib/placeholder-data';
import { fullPlaceholderArticles } from '@/lib/placeholder-data-full';
import { useState, useEffect } from 'react';

type Article = (typeof placeholderArticles)[0] & { contentEnglish: string, contentGujarati: string, author: string, publicationDate: string };

function AuthorDisplay({ author }: { author: Reporter | null }) {
    if (!author) {
        return (
            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">Unknown Author</p>
                </div>
            </div>
        );
    }
    
    const authorName = author.name || "Unnamed Author";

    return (
        <div className="flex items-center space-x-4">
            <Avatar>
                {author.profilePictureUrl && <AvatarImage src={author.profilePictureUrl} alt={authorName} />}
                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{authorName}</p>
            </div>
        </div>
    );
}

export default function ArticlePage() {
    const params = useParams();
    const lang = params.lang as 'en' | 'gu';
    const slug = params.slug as string;

    const [article, setArticle] = useState<Article | null | undefined>(undefined);
    const [author, setAuthor] = useState<Reporter | null>(null);

    useEffect(() => {
        const storedArticles = localStorage.getItem('articles');
        const articlesToSearch = storedArticles ? JSON.parse(storedArticles) : placeholderArticles;
        
        const articleExcerpt = articlesToSearch.find((a: Article) => a.slug === slug);
        const articleContent = fullPlaceholderArticles.find(a => a.slug === slug);
    
        if (articleExcerpt) {
            const fullArticle = {
                ...articleExcerpt,
                contentEnglish: articleContent?.contentEnglish || '',
                contentGujarati: articleContent?.contentGujarati || '',
            };
            setArticle(fullArticle as Article);

            const foundAuthor = placeholderReporters.find(r => r.name === fullArticle.author);
            setAuthor(foundAuthor || null);
        } else {
            setArticle(null);
        }
    }, [slug]);

    if (article === undefined) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (article === null) {
        notFound();
    }

    const articleTitle = lang === 'en' ? article.titleEnglish : article.titleGujarati;
    const articleExcerpt = lang === 'en' ? article.excerptEnglish : article.excerptGujarati;
    const articleContent = (lang === 'en' ? article.contentEnglish : article.contentGujarati) || '';

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
                        <AuthorDisplay author={author} />
                        <p className="text-sm text-muted-foreground">
                        Published on {new Date(article.publicationDate).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
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

                        <div className="col-span-12 md:col-span-8 lg:col-span-7 prose prose-lg dark:prose-invert max-w-full font-body"
                            dangerouslySetInnerHTML={{ __html: articleContent.replace(/\\n/g, '<br />') }}
                        />

                        <aside className="col-span-12 md:col-span-3 lg:col-span-3 space-y-8">
                            <AdContainer type="vertical" className="hidden md:flex"/>
                        </aside>
                    </div>
                </div>

                <Separator />

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

// Adding a loading file for better UX
export function Loading() {
    return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
}
