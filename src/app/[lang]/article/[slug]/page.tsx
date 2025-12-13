
import { notFound } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';
import { firestore } from '@/firebase/server';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, Link as LinkIcon, MessageCircle, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AdContainer } from '@/components/ad-container';
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
    lang: 'en' | 'gu';
};

async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const articlesCollection = collection(firestore, 'articles');
    // A composite index on ('slug', 'lang') would be ideal, but for now,
    // querying by slug is more resilient if that index doesn't exist.
    const q = query(articlesCollection, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    // If multiple articles have the same slug (e.g., for different languages),
    // this will pick the first one. This logic can be refined if needed.
    const articleDoc = querySnapshot.docs[0];
    return { id: articleDoc.id, ...articleDoc.data() } as Article;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    // Re-throw the error to be caught by the page component
    throw new Error('Failed to fetch article from database.');
  }
}

async function getAuthorById(authorId: string): Promise<Reporter | null> {
    if (!authorId) return null;
    try {
        const authorRef = doc(firestore, 'authors', authorId);
        const authorSnap = await getDoc(authorRef);
        if (authorSnap.exists()) {
            return authorSnap.data() as Reporter;
        }
        return null;
    } catch (error) {
        console.error("Error fetching author:", error);
        // Don't throw here, an article can exist without an author
        return null;
    }
}

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
                <AvatarImage src={author.profilePictureUrl} alt={authorName} />
                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{authorName}</p>
            </div>
        </div>
    );
}

export default async function ArticlePage({ params }: { params: { lang: 'en' | 'gu', slug: string } }) {
    const { lang, slug } = params;

    let article: Article | null = null;
    let author: Reporter | null = null;
    let fetchError: string | null = null;

    try {
        article = await getArticleBySlug(slug);

        if (article) {
            author = await getAuthorById(article.authorId);
        }
    } catch (error: any) {
        fetchError = error.message || "An unexpected error occurred while loading the article.";
    }

    if (fetchError) {
        return (
            <div className="container mx-auto px-4 py-16 text-center text-destructive">
                <h1 className="text-2xl font-bold mb-4">Error Loading Article</h1>
                <p>{fetchError}</p>
                <p className="mt-2 text-sm text-muted-foreground">Please check your Firestore security rules and collection indexes.</p>
            </div>
        );
    }

    if (!article) {
        return notFound();
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
