
'use client';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, Newspaper, Link as LinkIcon, Download, CreditCard, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import QRCode from 'qrcode.react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PressCardFront } from '@/components/press-card-front';
import { PressCardBack } from '@/components/press-card-back';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Reporter } from '@/lib/definitions';
import { placeholderArticles } from '@/lib/placeholder-data';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function ReporterProfilePage() {
    const params = useParams();
    const lang = params.lang as 'en' | 'gu';
    const id = params.id as string;
    
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [clientReporterUrl, setClientReporterUrl] = useState('');

    const frontCardRef = useRef<HTMLDivElement>(null);
    const backCardRef = useRef<HTMLDivElement>(null);

    const { firestore } = useFirebase();
    const authorDocRef = useMemoFirebase(() => (firestore && id ? doc(firestore, 'authors', id) : null), [firestore, id]);
    const { data: author, isLoading: isAuthorLoading } = useDoc<Reporter>(authorDocRef);
    
    // Using placeholder articles for now as we don't have a live article collection by author
    const [authorArticles, setAuthorArticles] = useState<typeof placeholderArticles>([]);

    useEffect(() => {
        if (author) {
            const articles = placeholderArticles.filter(a => a.author === author.name);
            setAuthorArticles(articles);
        }
    }, [author]);
    
    useEffect(() => {
        if (typeof window !== 'undefined' && author) {
            setClientReporterUrl(`${window.location.origin}/${lang}/reporters/${author.id}`);
        }
    }, [lang, author]);
    
    if (isAuthorLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        );
    }
    
    if (!author) {
        return (
            <div className="container mx-auto max-w-4xl py-12">
                <Alert variant="destructive">
                    <AlertTitle>Reporter Not Found</AlertTitle>
                    <AlertDescription>The reporter you are looking for does not exist or the link is incorrect.</AlertDescription>
                </Alert>
            </div>
        );
    }
    
    const handleDownload = async () => {
        const frontNode = frontCardRef.current;
        const backNode = backCardRef.current;
        if (!frontNode || !backNode) return;
    
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
    
        // Standard credit card size (ID-1) in mm
        const cardWidthMM = 85.6;
        const cardHeightMM = 53.98;
        const cardAspectRatio = cardHeightMM / cardWidthMM;
    
        // Calculate position to center the card on the PDF page
        const x = (pdfWidth - cardWidthMM) / 2;
        const y = 20; // Margin from top
    
        const addImageToPdf = async (node: HTMLDivElement, pageNumber: number) => {
             const canvasOptions = {
                scale: 3, // Increase scale for better resolution
                useCORS: true,
                willReadFrequently: true,
                width: node.offsetWidth,
                height: node.offsetHeight,
            };
            const canvas = await html2canvas(node, canvasOptions);
            const imgData = canvas.toDataURL('image/png', 1.0);
    
            if (pageNumber > 1) {
                pdf.addPage();
            }
            
            // Here, we use the card's aspect ratio to ensure it's not distorted.
            pdf.addImage(imgData, 'PNG', x, y, cardWidthMM, cardWidthMM * (node.offsetHeight / node.offsetWidth));
        };
    
        await addImageToPdf(frontNode, 1);
        await addImageToPdf(backNode, 2);
    
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
                                    {author.profilePictureUrl && <AvatarImage src={author.profilePictureUrl} alt={author.name} />}
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
                                {clientReporterUrl && <QRCode
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
                                    />}
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
                                    <span>{authorArticles?.length ?? 0} Articles Published</span>
                                </div>
                                {clientReporterUrl && <div className="flex items-center">
                                <LinkIcon className="w-5 h-5 mr-3 text-muted-foreground" />
                                <Link href={clientReporterUrl} className="text-primary hover:underline truncate">{clientReporterUrl}</Link>
                                </div>}
                            </div>

                            <Separator className="my-8" />
                            <h2 className="text-2xl font-bold font-headline mb-4">Recent Articles</h2>
                            <div className="space-y-4">
                                {authorArticles && authorArticles.length > 0 ? (
                                    authorArticles.map(article => {
                                        const title = lang === 'en' ? article.titleEnglish : article.titleGujarati;
                                        return (
                                            <Link key={article.id} href={`/${lang}/article/${article.slug}`} className="block hover:bg-muted/50 p-3 rounded-md">
                                                <h3 className="font-bold">{title}</h3>
                                                {article.publicationDate && (
                                                    <p className="text-sm text-muted-foreground">{new Date(article.publicationDate).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                )}
                                            </Link>
                                        )
                                    })
                                ) : (
                                   <p className="text-muted-foreground">No articles published yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {author && <Dialog open={isCardOpen} onOpenChange={setIsCardOpen}>
                <DialogContent className="bg-transparent border-none shadow-none p-4 sm:max-w-4xl flex flex-col max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Reporter Press Card: {author.name}</DialogTitle>
                         <DialogDescription>
                            Official press card for {author.name}. You can download this card as a PDF.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-grow overflow-y-auto">
                        <div className="flex flex-wrap justify-center items-center gap-8 p-4">
                            <div ref={frontCardRef}>
                                <PressCardFront reporter={author} lang={lang} />
                            </div>
                            <div ref={backCardRef}>
                                <PressCardBack reporter={author} reporterUrl={clientReporterUrl} lang={lang} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-center flex-shrink-0">
                         <Button id="download-png" className="download-png-btn" onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download as PDF
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>}
        </>
    )
}

    

    