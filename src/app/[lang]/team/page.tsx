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
  const [isFlipped, setIsFlipped] = useState(false);
  
  const reporterImage = PlaceHolderImages.find((img) => img.id === reporter.imageId);

  const t = {
    dob: lang === 'en' ? 'D.O.B' : 'જન્મતારીખ',
    contact: lang === 'en' ? 'Contact' : 'સંપર્ક',
    headOffice: lang === 'en' ? 'Head Office' : 'મુખ્ય કાર્યાલય',
    officePhone: lang === 'en' ? 'Office Phone' : 'ઓફિસ ફોન',
    tagline: lang === 'en' ? 'With The Truth' : 'સત્યની સાથે',
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={cn("flip-card w-[340px] h-[540px] [perspective:1000px]")} onClick={handleCardClick}>
      <div className={cn("flip-card-inner", isFlipped ? 'is-flipped' : '')}>
        {/* Card Front */}
        <div className="flip-card-front bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden border flex flex-col">
            <div className="py-2 flex justify-center items-center border-b">
                 <Image src="/logo.png" alt="JD News Logo" width={100} height={25} style={{paddingTop: '4px', paddingBottom: '4px'}} />
            </div>
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
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
                <div className="border-t w-full my-4"></div>
                <div className="space-y-2 text-left w-full text-sm">
                    <div className="flex items-center gap-3">
                        <Cake className="w-4 h-4 text-muted-foreground"/>
                        <span><span className="font-semibold">{t.dob}:</span> {reporter.dob}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground"/>
                        <span><span className="font-semibold">{t.contact}:</span> {reporter.contact}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-muted-foreground"/>
                        <span className="truncate"><span className="font-semibold">Office:</span> {reporter.officeLocation}</span>
                    </div>
                </div>
            </div>
            <div className="bg-red-600 text-white text-center py-2 font-bold text-lg tracking-widest">
                PRESS
            </div>
        </div>

        {/* Card Back */}
        <div className="flip-card-back bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden border flex flex-col justify-between p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-card via-card to-muted/50">
            <div className="absolute inset-0 bg-repeat bg-center opacity-5" style={{backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill-rule='evenodd'%3e%3cg fill='%239C92AC' fill-opacity='0.15'%3e%3cpath d='M99 99V0h1v100H0v-1h99zM99 1V0H0v1h99z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`}}></div>
             <div className="text-center relative">
                <Image src="/logo.png" alt="JD News Logo" width={150} height={40} className="mx-auto mb-4" />
                <h3 className="font-bold text-lg">{t.headOffice}</h3>
                <p className="text-xs text-muted-foreground">201/202, Akhbar Bhavan, Sector 11,</p>
                <p className="text-xs text-muted-foreground">Near Hotel Haveli, Gandhinagar, Gujarat</p>
                <p className="text-xs mt-2 text-muted-foreground"><span className="font-semibold">{t.officePhone}:</span> +91 79 1234 5678</p>
            </div>
            <div className="flex items-center justify-center relative">
                <div className="text-center">
                    <div className="w-32 h-32 mx-auto text-foreground bg-white p-2 rounded-md">
                        <QrCodeSvg />
                    </div>
                     <p className="text-xs text-muted-foreground mt-1">Verify Authenticity</p>
                </div>
            </div>
            <div className="text-center relative">
                <p className="text-primary font-bold text-lg font-headline">{t.tagline}</p>
                <p className="text-xs text-muted-foreground">www.jdnews.in</p>
            </div>
        </div>
      </div>
    </div>
  );
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
                        />
                      )}
                    </div>
                    {reporter.verified && 
                      <Badge variant="default" className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                      </Badge>
                    }
                  </CardHeader>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-bold font-headline">{reporter.name}</h2>
                    <p className="text-primary font-medium">{reporter.title}</p>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </div>

      <Dialog open={!!selectedReporter} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="bg-transparent border-none shadow-none max-w-md p-0">
           <VisuallyHidden>
            <DialogTitle>Reporter Press Card</DialogTitle>
           </VisuallyHidden>
           {selectedReporter && (
            <div className="flex flex-col items-center gap-4">
                <PressCard reporter={selectedReporter} lang={lang}/>
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
