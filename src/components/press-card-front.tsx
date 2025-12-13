
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
    <div className="w-[340px] h-[540px] bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden border flex flex-col">
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
        {reporter.profilePictureUrl && (
          <Image
            src={reporter.profilePictureUrl}
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

    