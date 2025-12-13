'use client';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
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
import { PressCardFront } from '@/components/press-card-front';
import { PressCardBack } from '@/components/press-card-back';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ReporterProfilePage() {
    const params = useParams<{ lang: 'en' | 'gu', id: string }>();
    const { lang } = params;
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [clientReporterUrl, setClientReporterUrl] = useState('');
    const frontCardRef = useRef<HTMLDivElement>(null);
    const backCardRef = useRef<HTMLDivElement>(null);
    
    const author = placeholderReporters.find((r) => r.id === 'priya-patel');
    
    useEffect(() => {
        if (typeof window !== 'undefined' && author) {
            setClientReporterUrl(`${window.location.origin}/${lang}/reporters/${author.id}`);
        }
    }, [lang, author]);

    if (!author) {
        notFound();
    }
    
    const authorImage = PlaceHolderImages.find(img => img.id === author.imageId);
    const authorArticles = placeholderArticles.filter(a => a.author === author.name);

    const handleDownload = async () => {
        if (!frontCardRef.current || !backCardRef.current) return;
    
        const pdf = new jsPDF();
    
        const canvasFront = await html2canvas(frontCardRef.current, { scale: 2 });
        const imgDataFront = canvasFront.toDataURL('image/png');
    
        const cardWidth = 340;
        const cardHeight = 540;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = cardHeight / cardWidth;
        let finalWidth = pdfWidth * 0.8;
        let finalHeight = finalWidth * ratio;
        
        if (finalHeight > pdfHeight * 0.9) {
            finalHeight = pdfHeight * 0.9;
            finalWidth = finalHeight / ratio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        pdf.addImage(imgDataFront, 'PNG', x, y, finalWidth, finalHeight);
    
        const canvasBack = await html2canvas(backCardRef.current, { scale: 2 });
        const imgDataBack = canvasBack.toDataURL('image/png');
        pdf.addPage();
        pdf.addImage(imgDataBack, 'PNG', x, y, finalWidth, finalHeight);
    
        pdf.save(`${author.name}-Press-Card.pdf`);
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
                                    value={clientReporterUrl}
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
                                <Link href={clientReporterUrl} className="text-primary hover:underline truncate">{clientReporterUrl}</Link>
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
                <DialogContent className="bg-transparent border-none shadow-none max-w-md p-0 data-[state=open]:sm:max-w-4xl">
                    <VisuallyHidden>
                        <DialogTitle>Reporter Press Card</DialogTitle>
                    </VisuallyHidden>
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-wrap justify-center gap-4">
                             <div ref={frontCardRef}>
                                <PressCardFront reporter={author} lang={lang} />
                            </div>
                            <div ref={backCardRef}>
                                <PressCardBack reporter={author} lang={lang} />
                            </div>
                        </div>
                         <div className="flex justify-center mt-4">
                            <Button onClick={handleDownload}>
                                <Download className="mr-2 h-4 w-4" />
                                Download Cards
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
