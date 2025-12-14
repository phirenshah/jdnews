
'use client';
import Image from 'next/image';
import { Reporter } from '@/lib/definitions';
import { Cake, Phone, Building } from 'lucide-react';

export function PressCardFront({
  reporter,
  lang,
}: {
  reporter: Reporter;
  lang: string;
}) {
  const t = {
    dob: lang === 'en' ? 'D.O.B' : 'જન્મતારીખ',
    contact: lang === 'en' ? 'Contact' : 'સંપર્ક',
    office: lang === 'en' ? 'Office' : 'ઓફિસ',
  };

  return (
    <div className="w-[320px] h-[504px] bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden border flex flex-col">
      <div className="border-t w-full"></div>
      <div className="flex-grow flex flex-col items-center justify-start text-center px-4 pt-6">
        <div className="h-[40px] flex items-center justify-center mb-4">
            <Image
            src="/logo.png"
            alt="JD News Logo"
            width={100}
            height={23}
            />
        </div>
        {reporter.profilePictureUrl && (
          <div className="w-36 h-36 relative">
            <Image
                src={reporter.profilePictureUrl}
                alt={`${reporter.name}`}
                fill
                sizes="144px"
                className="rounded-full border-4 border-primary/50 object-cover"
            />
          </div>
        )}
        <h3 className="font-headline text-2xl font-bold mt-4">{reporter.name}</h3>
        <p className="text-primary font-medium">{reporter.title}</p>

        <div className="space-y-2 text-left w-full text-sm mt-4">
          <div className="flex items-center gap-3">
            <Cake className="w-4 h-4 text-muted-foreground" />
            <span>
              <span className="font-semibold">{t.dob}:</span> {reporter.dob}
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
  );
}
