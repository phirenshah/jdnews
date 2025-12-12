'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { placeholderReporters } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reporter } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const QrCodeSvg = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0H30V30H0V0ZM10 10H20V20H10V10Z"
      fill="currentColor"
    />
    <path d="M40 0H50V10H40V0Z" fill="currentColor" />
    <path d="M60 0H70V10H60V0Z" fill="currentColor" />
    <path d="M40 20H50V30H40V20Z" fill="currentColor" />
    <path d="M90 20H100V30H90V20Z" fill="currentColor" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M70 0H100V30H70V0ZM80 10H90V20H80V10Z"
      fill="currentColor"
    />
    <path d="M0 40H10V50H0V40Z" fill="currentColor" />
    <path d="M20 40H30V50H20V40Z" fill="currentColor" />
    <path d="M40 40H50V50H40V40Z" fill="currentColor" />
    <path d="M60 40H70V50H60V40Z" fill="currentColor" />
    <path d="M80 40H90V50H80V40Z" fill="currentColor" />
    <path d="M0 60H10V70H0V60Z" fill="currentColor" />
    <path d="M40 60H50V70H40V60Z" fill="currentColor" />
    <path d="M70 60H80V70H70V60Z" fill="currentColor" />
    <path d="M90 60H100V70H90V60Z" fill="currentColor" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 70H30V100H0V70ZM10 80H20V90H10V80Z"
      fill="currentColor"
    />
    <path d="M40 80H50V90H40V80Z" fill="currentColor" />
    <path d="M60 80H80V90H60V80Z" fill="currentColor" />
    <path d="M90 80H100V90H90V80Z" fill="currentColor" />
  </svg>
);

function PressCard({ reporter, lang }: { reporter: Reporter; lang: string }) {
  const reporterImage = PlaceHolderImages.find((img) => img.id === reporter.imageId);
  const t = {
    designation: lang === 'en' ? 'Designation' : 'હોદ્દો',
    dob: lang === 'en' ? 'D.O.B' : 'જન્મતારીખ',
    bloodGroup: lang === 'en' ? 'B.Group' : 'બ્લડ ગ્રુપ',
    contactNo: lang === 'en' ? 'Contact No' : 'સંપર્ક નંબર',
    headOffice: lang === 'en' ? 'Head Office' : 'મુખ્ય કાર્યાલય',
    emergency: lang === 'en' ? 'Emergency' : 'ઇમરજન્સી',
    authSign: lang === 'en' ? 'Auth. Sign' : 'અધિકૃત સહી',
    tagline: lang === 'en' ? 'With The Truth' : 'સત્યની સાથે',
  };

  return (
    <div className="flip-card-inner">
      {/* Card Front */}
      <div className="flip-card-front bg-white text-black rounded-lg shadow-xl overflow-hidden">
        <div className="flex h-full">
          <div className="w-1/6 bg-red-600 flex items-center justify-center">
            <h2 className="text-white font-bold text-5xl tracking-widest" style={{ writingMode: 'vertical-rl' }}>
              PRESS
            </h2>
          </div>
          <div className="w-5/6 p-4 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Image src="/logo.png" alt="JD News Logo" width={150} height={40} className="dark:invert" />
                 <div className="text-left mt-1">
                  <p className="font-bold text-sm">JD MEDIA</p>
                  <p className="text-xs">GJ-01-0017316</p>
                </div>
              </div>
              <div className="bg-red-600 text-white px-2 py-1 text-xs rounded-md">{t.tagline}</div>
            </div>
            <Separator className="my-4 bg-black" />
            <div className="flex-grow flex items-center">
              <div className="w-2/3 pr-4">
                <p><span className="font-bold">{t.designation}:</span> {reporter.title}</p>
                <p><span className="font-bold">{t.dob}:</span> 21/12/75</p>
                <p><span className="font-bold">{t.bloodGroup}:</span> +AB</p>
                <p><span className="font-bold">{t.contactNo}:</span> 8140009001</p>
              </div>
              <div className="w-1/3">
                {reporterImage && (
                  <div className="border-2 border-black p-0.5">
                    <Image src={reporterImage.imageUrl} alt={reporter.name} width={100} height={120} className="w-full object-cover" />
                  </div>
                )}
                <p className="text-xs text-center mt-1">GJ-01-0017316-01</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Back */}
      <div className="flip-card-back bg-white text-black rounded-lg shadow-xl overflow-hidden p-4 flex flex-col justify-between">
         <div className="text-center">
            <h3 className="font-bold text-lg">JD MEDIA</h3>
            <p className="font-semibold text-sm">{t.headOffice}</p>
            <p className="text-xs">201/202, Akhbar Bhavan, Sector 11,</p>
            <p className="text-xs">Near Hotel Haveli, Gandhinagar, Gujarat</p>
            <p className="text-xs mt-2">Email: contact@jdnews.com</p>
            <p className="text-xs">www.jdnews.com</p>
        </div>
        <div className="flex items-end justify-between">
            <div className="text-center">
                <div className="w-20 h-20 mx-auto text-black">
                    <QrCodeSvg />
                </div>
                 <p className="text-xs">Verify Authenticity</p>
            </div>
             <div className="text-center">
                <p className="font-serif italic text-lg">Signature</p>
                <p className="text-xs border-t border-black mt-1 pt-1">{t.authSign}</p>
            </div>
            <div className="text-center">
                <p className="font-bold text-sm">{t.emergency}</p>
                <p className="text-xs">9978413456</p>
                <p className="text-xs">9978433144</p>
            </div>
        </div>
      </div>
    </div>
  );
}


export default function ReportersPage({ params: { lang } }: { params: { lang: 'en' | 'gu' } }) {
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
  
  const handleDownload = () => {
    // In a real app, you'd use a library like html2canvas to capture the card element.
    alert("Downloading press card...");
  }


  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="text-lg text-muted-foreground mt-2">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {placeholderReporters.map((reporter) => {
            const reporterImage = PlaceHolderImages.find((img) => img.id === reporter.imageId);
            return (
              <Card
                key={reporter.id}
                className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
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
                        data-ai-hint={reporterImage.imageHint}
                      />
                    )}
                  </div>
                  <Badge variant="default" className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </Badge>
                </CardHeader>
                <CardContent className="p-4">
                  <h2 className="text-xl font-bold font-headline">{reporter.name}</h2>
                  <p className="text-primary font-medium">{reporter.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedReporter} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="bg-transparent border-none shadow-none max-w-2xl p-0">
           {selectedReporter && (
            <div className="flex flex-col items-center gap-4">
                 <div className="flip-card w-[350px] h-[550px] md:w-[400px] md:h-[600px] [perspective:1000px]">
                    <PressCard reporter={selectedReporter} lang={lang}/>
                </div>
                <div className='flex gap-4'>
                    <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
