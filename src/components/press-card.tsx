'use client';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Reporter } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import QRCode from 'qrcode.react';
import { Cake, Phone, Building } from 'lucide-react';

export function PressCard({
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
