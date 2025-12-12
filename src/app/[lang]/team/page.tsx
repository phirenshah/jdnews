'use client';
import { useState, use } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, X, Building, Phone, Cake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reporter } from '@/lib/definitions';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { placeholderReporters } from '@/lib/placeholder-data';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import QRCode from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import Link from 'next/link';

function PressCard({
  reporter,
  lang,
  isForExport = false,
  forceState,
}: {
  reporter: Reporter;
  lang: string;
  isForExport?: boolean;
  forceState?: 'front' | 'back';
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const reporterImage = PlaceHolderImages.find(
    (img) => img.id === reporter.imageId
  );

  const reporterUrl = `/${lang}/reporters/${reporter.id}`;


  const t = {
    dob: lang === 'en' ? 'D.O.B' : 'જન્મતારીખ',
    contact: lang === 'en' ? 'Contact' : 'સંપર્ક',
    office: lang === 'en' ? 'Office' : 'ઓફિસ',
    headOffice: lang === 'en' ? 'Head Office' : 'મુખ્ય કાર્યાલય',
    officePhone: lang === 'en' ? 'Office Phone' : 'ઓફિસ ફોન',
    tagline: lang === 'en' ? 'With The Truth' : 'સત્યની સાથે',
  };

  const handleCardClick = () => {
    if (isForExport) return;
    setIsFlipped(!isFlipped);
  };
  
  const cardInner = (
    <div
      className={cn('flip-card-inner', {
        'is-flipped': !isForExport && isFlipped,
        '[transform:rotateY(0deg)]': isForExport && forceState === 'front',
        '[transform:rotateY(180deg)]': isForExport && forceState === 'back',
        'relative w-full h-full text-center transition-transform duration-700': !isForExport,
      })}
       style={{ transformStyle: isForExport ? 'flat' : 'preserve-3d' }}
    >
      {/* Card Front */}
        <div className={cn("flip-card-front bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden border flex flex-col", {'absolute w-full h-full [-webkit-backface-visibility:hidden] [backface-visibility:hidden]': !isForExport})}>
          <div className="py-2 flex justify-center items-center">
            <Image
              src="/logo.png"
              alt="JD News Logo"
              width={100}
              height={0}
              style={{
                paddingTop: '4px',
                paddingBottom: '4px',
                height: 'auto',
              }}
            />
          </div>
          <div className="border-t w-full"></div>
          <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-2">
            {reporterImage && (
              <Image
                src={reporterImage.imageUrl}
                alt={`${reporter.name}`}
                width={140}
                height={140}
                className="rounded-full border-4 border-primary/50 object-cover mb-4"
              />
            )}
            <h3 className="font-headline text-2xl font-bold">{reporter.name}</h3>
            <p className="text-primary font-medium">{reporter.title}</p>

            <div className="space-y-2 text-left w-full text-sm mt-4">
              <div className="flex items-center gap-3">
                <Cake className="w-4 h-4 text-muted-foreground" />
                <span>
                  <span className="font-semibold">{t.dob}:</span>{' '}
                  {reporter.dob}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>
                  <span className="font-semibold">{t.contact}:</span>{' '}
                  {reporter.contact}
                </span>
              </div>
              <div className="flex items-center gap-3 my-4">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">
                  <span className="font-semibold">{t.office}:</span>{' '}
                  {reporter.officeLocation}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-red-600 text-white text-center py-2 font-bold text-xl tracking-widest font-code">
            PRESS
          </div>
        </div>

        {/* Card Back */}
        <div className={cn("flip-card-back bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden border flex flex-col justify-between p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-card via-card to-muted/50", {'absolute w-full h-full [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)]': !isForExport})}>
          <div
            className="absolute inset-0 bg-repeat bg-center opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill-rule='evenodd'%3e%3cg fill='%239C92AC' fill-opacity='0.15'%3e%3cpath d='M99 99V0h1v100H0v-1h99zM99 1V0H0v1h99z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
            }}
          ></div>
          <div className="text-center relative">
            <Image
              src="/logo.png"
              alt="JD News Logo"
              width={150}
              height={40}
              className="mx-auto"
            />
            <h3 className="font-bold text-lg">{t.headOffice}</h3>
            <p className="text-xs text-muted-foreground">
              201/202, Akhbar Bhavan, Sector 11,
            </p>
            <p className="text-xs text-muted-foreground">
              Near Hotel Haveli, Gandhinagar, Gujarat
            </p>
            <p className="text-xs mt-2 text-muted-foreground">
              <span className="font-semibold">{t.officePhone}:</span> +91 79
              1234 5678
            </p>
          </div>
          <div className="flex items-center justify-center relative">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-md">
                <QRCode
                  value={reporterUrl}
                  size={112}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                  imageSettings={{
                    src: '/logo.png',
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Verify Authenticity
              </p>
            </div>
          </div>
          <div className="text-center relative">
            <p className="text-primary font-bold text-lg font-headline">
              {t.tagline}
            </p>
            <p className="text-xs text-muted-foreground">www.jdnews.in</p>
          </div>
        </div>
    </div>
  );

  if (isForExport) {
    return cardInner;
  }

  return (
    <div
      className={cn('flip-card w-[340px] h-[540px] [perspective:1000px]')}
      onClick={handleCardClick}
    >
        {cardInner}
    </div>
  )
}

export default function ReportersPage({ params }: { params: { lang: 'en' | 'gu' } }) {
  const { lang } = use(params);
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
    
    // Force light theme for PDF rendering
    const existingClasses = document.documentElement.className;
    exportContainer.className = existingClasses.replace('dark', '') + ' light';

    document.body.appendChild(exportContainer);

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [380, 580]
    });

    try {
      // --- Render and capture FRONT of the card ---
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
      pdf.addImage(canvasFront.toDataURL('image/png'), 'PNG', 20, 20, 340, 540);
      frontRoot.unmount();
      frontDiv.remove();

      // --- Render and capture BACK of the card ---
      pdf.addPage();
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
      pdf.addImage(canvasBack.toDataURL('image/png'), 'PNG', 20, 20, 340, 540);
      backRoot.unmount();
      backDiv.remove();

      pdf.save(`${selectedReporter.name.replace(' ', '-')}-Press-Card.pdf`);

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
