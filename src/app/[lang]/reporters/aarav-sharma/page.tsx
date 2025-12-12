'use client';
import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, Newspaper, Link as LinkIcon, Download, X, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { placeholderReporters, placeholderArticles } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import QRCode from 'qrcode.react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { PressCard } from '@/components/press-card';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';

export default function ReporterProfilePage({ params }: { params: { lang: 'en' | 'gu', id: string } }) {
    const { lang, id } = params;
    const [isCardOpen, setIsCardOpen] = useState(false);
    
    const author = placeholderReporters.find((r) => r.id === 'aarav-sharma');
    
    if (!author) {
        notFound();
    }
    
    const authorImage = PlaceHolderImages.find(img => img.id === author.imageId);
    const authorArticles = placeholderArticles.filter(a => a.author === author.name);
    const reporterUrl = `/${lang}/reporters/${author.id}`;

    const handleDownload = async () => {
        if (!author) return;
    
        const exportContainer = document.createElement('div');
        exportContainer.style.position = 'fixed';
        exportContainer.style.left = '-9999px';
        exportContainer.style.top = '-9999px';
    
        const existingClasses = document.documentElement.className;
        exportContainer.className = existingClasses.replace('dark', '') + ' light';
        
        document.body.appendChild(exportContainer);
    
        try {
          // --- Render and capture FRONT of the card ---
          const frontDiv = document.createElement('div');
          exportContainer.appendChild(frontDiv);
          const frontRoot = createRoot(frontDiv);
    
          await new Promise<void>(resolve => {
            frontRoot.render(
              <div className="w-[340px] h-[540px]" style={{transform: "none"}}>
                  <PressCard reporter={author} lang={lang} isForExport={true} forceState="front" />
              </div>
            );
            setTimeout(resolve, 500);
          });
    
          const frontElement = frontDiv.querySelector('.flip-card-front');
          if (!frontElement) throw new Error("Front card element not found for PNG generation");
          const canvasFront = await html2canvas(frontElement as HTMLElement, { scale: 2 });
          const linkFront = document.createElement('a');
          linkFront.download = `${author.name.replace(' ', '-')}-Front.png`;
          linkFront.href = canvasFront.toDataURL('image/png');
          linkFront.click();
          frontRoot.unmount();
          frontDiv.remove();
    
          // --- Render and capture BACK of the card (mirrored) ---
          const backDiv = document.createElement('div');
          exportContainer.appendChild(backDiv);
          const backRoot = createRoot(backDiv);
          
          await new Promise<void>(resolve => {
            backRoot.render(
              <div className="w-[340px] h-[540px]" style={{transform: "rotateY(180deg)"}}>
                  <PressCard reporter={author} lang={lang} isForExport={true} forceState="back" />
              </div>
            );
            setTimeout(resolve, 500);
          });
          
          const backElement = backDiv.querySelector('.flip-card-back');
          if (!backElement) throw new Error("Back card element not found for PNG generation");
          const canvasBack = await html2canvas(backElement as HTMLElement, { scale: 2 });
          const linkBack = document.createElement('a');
          linkBack.download = `${author.name.replace(' ', '-')}-Back-Mirrored.png`;
          linkBack.href = canvasBack.toDataURL('image/png');
          linkBack.click();
          backRoot.unmount();
          backDiv.remove();
    
        } catch (error) {
          console.error("Failed to generate PNG:", error);
        } finally {
          document.body.removeChild(exportContainer);
        }
      };

    return (
        <>
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
                                <div className="w-48 h-48 mx-auto bg-white p-2 rounded-md flex items-center justify-center">
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
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold font-headline">About {author.name}</h2>
                                <Button onClick={() => setIsCardOpen(true)}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    View Press Card
                                </Button>
                            </div>

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
            <Dialog open={isCardOpen} onOpenChange={setIsCardOpen}>
                <DialogContent className="bg-transparent border-none shadow-none max-w-md p-0">
                    <VisuallyHidden>
                        <DialogTitle>Reporter Press Card</DialogTitle>
                    </VisuallyHidden>
                    <div className="flex flex-col items-center gap-4">
                        <PressCard reporter={author} lang={lang} />
                        <div className="flex gap-4">
                            <Button
                            onClick={handleDownload}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                            <Download className="mr-2 h-4 w-4" />
                            Download Card
                            </Button>
                            <Button onClick={() => setIsCardOpen(false)} variant="outline">
                            <X className="mr-2 h-4 w-4" />
                            Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
