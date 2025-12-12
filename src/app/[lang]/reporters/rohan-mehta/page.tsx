
import { useMemo } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, Newspaper, Link as LinkIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { placeholderReporters, placeholderArticles } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import QRCode from 'qrcode.react';
import Link from 'next/link';

export default function ReporterProfilePage({ params }: { params: { lang: 'en' | 'gu', id: string } }) {
    const { lang, id } = params;
    
    const author = placeholderReporters.find((r) => r.id === 'rohan-mehta');
    
    if (!author) {
        notFound();
    }
    
    const authorImage = PlaceHolderImages.find(img => img.id === author.imageId);
    const authorArticles = placeholderArticles.filter(a => a.author === author.name);
    const reporterUrl = `/${lang}/reporters/${author.id}`;

    return (
        <div className="bg-muted/20 min-h-screen py-12">
            <div className="container mx-auto max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card p-6 rounded-lg shadow-md text-center">
                             <Avatar className="w-40 h-40 mx-auto mb-4 border-4 border-background ring-2 ring-primary">
                                {authorImage && <AvatarImage src={authorImage.imageUrl} alt={author.name} />}
                                <AvatarFallback className="text-5xl">{author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h1 className="text-3xl font-bold font-headline">{author.name}</h1>
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
                            <div className="w-48 h-48 mx-auto bg-white p-2 rounded-md">
                               <QRCode
                                  value={reporterUrl}
                                  size={176}
                                  bgColor="#ffffff"
                                  fgColor="#000000"
                                  level="Q"
                                  imageSettings={{
                                    src: '/logo.png',
                                    height: 32,
                                    width: 32,
                                    excavate: true,
                                  }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-2">Scan to verify authenticity</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-card p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold font-headline mb-4">About {author.name}</h2>
                        <p className="text-muted-foreground leading-relaxed">A dedicated and experienced journalist, {author.name} serves as a {author.title} at our {author.officeLocation}.</p>
                        
                        <Separator className="my-8" />

                        <div className="space-y-4">
                             <div className="flex items-center">
                                <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                                <a href={`mailto:${author.contact}`} className="text-primary hover:underline">{author.contact}</a>
                            </div>
                            <div className="flex items-center">
                                <Newspaper className="w-5 h-5 mr-3 text-muted-foreground" />
                                <span>{authorArticles.length} Articles Published</span>
                            </div>
                             <div className="flex items-center">
                               <LinkIcon className="w-5 h-5 mr-3 text-muted-foreground" />
                               <Link href={reporterUrl} className="text-primary hover:underline truncate">{reporterUrl}</Link>
                            </div>
                        </div>

                         <Separator className="my-8" />
                         <h2 className="text-2xl font-bold font-headline mb-4">Recent Articles</h2>
                         <div className="space-y-4">
                            {authorArticles.length > 0 ? (
                                authorArticles.map(article => (
                                    <Link key={article.id} href={`/${lang}/article/${article.slug}`} className="block hover:bg-muted/50 p-3 rounded-md">
                                        <h3 className="font-bold">{article.title[lang]}</h3>
                                        <p className="text-sm text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-muted-foreground">No articles published yet.</p>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
