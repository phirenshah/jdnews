'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reporter } from '@/lib/definitions';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { placeholderReporters } from '@/lib/placeholder-data';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import Link from 'next/link';
import { PressCard } from '@/components/press-card';

export default function ReportersPage({ params }: { params: { lang: 'en' | 'gu' } }) {
  const { lang } = params;
  const [selectedReporter, setSelectedReporter] = useState<Reporter | null>(null);

  const title = lang === 'en' ? 'Our Team' : 'અમારી ટીમ';
  const subtitle =
    lang === 'en'
      ? 'Meet the team behind the news'
      : 'સમાચાર પાછળની ટીમને મળો';

  const handleCardClick = (reporter: Reporter) => {
    setSelectedReporter(reporter);
  };

  const handleCloseDialog = () => {
    setSelectedReporter(null);
  };

  const handleDownload = async () => {
    if (!selectedReporter) return;
  
    const exportContainer = document.createElement('div');
    exportContainer.style.position = 'fixed';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '-9999px';
  
    const existingClasses = document.documentElement.className;
    exportContainer.className = existingClasses.replace('dark', '') + ' light';
    
    document.body.appendChild(exportContainer);
  
    try {
      // --- Render and capture FRONT of the card ---
      const pdfFront = new jsPDF({ orientation: 'p', unit: 'px', format: [380, 580] });
      const frontDiv = document.createElement('div');
      exportContainer.appendChild(frontDiv);
      const frontRoot = createRoot(frontDiv);
  
      await new Promise<void>(resolve => {
        frontRoot.render(
          <div className="w-[340px] h-[540px]" style={{transform: "none"}}>
              <PressCard reporter={selectedReporter} lang={lang} isForExport={true} forceState="front" />
          </div>
        );
        setTimeout(resolve, 500);
      });
  
      const frontElement = frontDiv.querySelector('.flip-card-front');
      if (!frontElement) throw new Error("Front card element not found for PDF generation");
      const canvasFront = await html2canvas(frontElement as HTMLElement, { scale: 2 });
      pdfFront.addImage(canvasFront.toDataURL('image/png'), 'PNG', 20, 20, 340, 540);
      pdfFront.save(`${selectedReporter.name.replace(' ', '-')}-Front.pdf`);
      frontRoot.unmount();
      frontDiv.remove();
  
      // --- Render and capture BACK of the card ---
      const pdfBack = new jsPDF({ orientation: 'p', unit: 'px', format: [380, 580] });
      const backDiv = document.createElement('div');
      exportContainer.appendChild(backDiv);
      const backRoot = createRoot(backDiv);
      
      await new Promise<void>(resolve => {
        backRoot.render(
          <div className="w-[340px] h-[540px]" style={{transform: "none"}}>
              <PressCard reporter={selectedReporter} lang={lang} isForExport={true} forceState="back" />
          </div>
        );
        setTimeout(resolve, 500);
      });
      
      const backElement = backDiv.querySelector('.flip-card-back');
      if (!backElement) throw new Error("Back card element not found for PDF generation");
      const canvasBack = await html2canvas(backElement as HTMLElement, { scale: 2 });
      pdfBack.addImage(canvasBack.toDataURL('image/png'), 'PNG', 20, 20, 340, 540);
      pdfBack.save(`${selectedReporter.name.replace(' ', '-')}-Back.pdf`);
      backRoot.unmount();
      backDiv.remove();
  
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      document.body.removeChild(exportContainer);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {placeholderReporters.map((reporter) => {
            const reporterImage = PlaceHolderImages.find(
              (img) => img.id === reporter.imageId
            );
            return (
              <Card
                key={reporter.id}
                className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group flex flex-col"
                onClick={() => handleCardClick(reporter)}
              >
                <CardHeader className="relative p-4">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-background ring-2 ring-primary">
                    {reporterImage && (
                      <Image
                        src={reporterImage.imageUrl}
                        alt={reporter.name}
                        width={128}
                        height={128}
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                  {reporter.verified && (
                    <Badge
                      variant="default"
                      className="absolute top-2 right-2 bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col justify-center">
                  <h2 className="text-xl font-bold font-headline">
                    <Link href={`/${lang}/reporters/${reporter.id}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
                        {reporter.name}
                    </Link>
                  </h2>
                  <p className="text-primary font-medium">{reporter.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog
        open={!!selectedReporter}
        onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}
      >
        <DialogContent className="bg-transparent border-none shadow-none max-w-md p-0">
          <VisuallyHidden>
            <DialogTitle>Reporter Press Card</DialogTitle>
          </VisuallyHidden>
          {selectedReporter && (
            <div className="flex flex-col items-center gap-4">
              <PressCard reporter={selectedReporter} lang={lang} />
              <div className="flex gap-4">
                <Button
                  onClick={handleDownload}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Card
                </Button>
                <Button onClick={handleCloseDialog} variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
