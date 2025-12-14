
'use client';
import Image from 'next/image';
import { Reporter } from '@/lib/definitions';
import { Cake, Phone, Building } from 'lucide-react';

export function PressCardFront({
  reporter,
}: {
  reporter: Reporter;
}) {
  const t = {
    dob: 'D.O.B',
    contact: 'Contact',
    office: 'Office',
  };

  return (
    <div className="w-[320px] h-[504px] bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden border flex flex-col">
      <div className="h-[70px] flex items-center justify-center border-b">
        <Image
          src="/logo.png"
          alt="JD News Logo"
          width={120}
          height={27}
        />
      </div>

      <div className="flex-grow flex flex-col items-center text-center px-4 pt-4">
        <div className="h-[144px]">
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
        </div>

        <div className="mt-4">
          <h3 className="font-headline text-2xl font-bold">{reporter.name}</h3>
          <p className="text-primary font-medium">{reporter.title}</p>
        </div>

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
          <div className="flex items-center gap-3">
            <Building className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1">
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
