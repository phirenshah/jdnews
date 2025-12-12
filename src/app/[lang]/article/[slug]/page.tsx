import { placeholderArticles, placeholderReporters } from '@/lib/placeholder-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, Link as LinkIcon, MessageCircle, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { AdContainer } from '@/components/ad-container';

export async function generateStaticParams() {
  return placeholderArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: { params: { lang: 'en' | 'gu'; slug: string } }) {
  const article = placeholderArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  const articleImage = PlaceHolderImages.find((img) => img.id === article.imageId);
  const author = placeholderReporters.find((r) => r.name === article.author);
  const authorImage = author ? PlaceHolderImages.find((img) => img.id === author.imageId) : null;
  const relatedStories = placeholderArticles.filter(p => p.id !== article.id).slice(0, 3);


  return (
    <div className="bg-background">
      <article>
        <header className="container mx-auto px-4 py-8 md:py-16 text-center">
          <p className="text-primary font-semibold mb-2">{article.category}</p>
          <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight mb-4">
            {article.title[params.lang]}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            {article.excerpt[params.lang]}
          </p>
          <div className="flex items-center justify-center space-x-4">
            {author && authorImage && (
              <Avatar>
                <AvatarImage src={authorImage.imageUrl} alt={author.name} data-ai-hint={authorImage.imageHint}/>
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <p className="font-semibold">{article.author}</p>
              <p className="text-sm text-muted-foreground">
                Published on {new Date(article.publishedAt).toLocaleDateString(params.lang, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </header>

        {articleImage && (
          <div className="relative h-[300px] md:h-[500px] bg-muted">
            <Image
              src={articleImage.imageUrl}
              alt={article.title[params.lang]}
              fill
              className="object-cover"
              data-ai-hint={articleImage.imageHint}
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
                    <p className="lead">{article.content[params.lang].substring(0, 200)}...</p>
                    <p>{article.content[params.lang]}</p>
                    <p>{article.content[params.lang]}</p>
                </div>

                <div className="col-span-12 md:col-span-3 lg:col-span-3 space-y-8">
                    <AdContainer type="vertical" className="hidden md:flex"/>
                </div>
            </div>
        </div>

        <Separator />

        {/* Related Stories */}
        <div className="container mx-auto px-4 py-12">
            <h2 className="font-headline text-3xl font-bold mb-6">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedStories.map((story, index) => {
                    const storyImage = PlaceHolderImages.find(img => img.id === `related-${index + 1}`);
                    return (
                        <Card key={story.id} className="shadow-md">
                            <Link href={`/${params.lang}/article/${story.slug}`}>
                                {storyImage && <Image src={storyImage.imageUrl} alt={story.title[params.lang]} width={300} height={200} className="w-full h-40 object-cover rounded-t-lg" data-ai-hint={storyImage.imageHint} />}
                                <CardContent className="p-4">
                                    <h3 className="font-headline font-bold text-lg leading-snug">{story.title[params.lang]}</h3>
                                </CardContent>
                            </Link>
                        </Card>
                    );
                })}
            </div>
        </div>

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
