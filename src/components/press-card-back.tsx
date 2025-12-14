
'use client';
import Image from 'next/image';
import { Reporter } from '@/lib/definitions';
import QRCode from 'qrcode.react';

export function PressCardBack({
  reporter,
  reporterUrl,
  lang,
}: {
  reporter: Reporter;
  reporterUrl: string;
  lang: string;
}) {

  const t = {
    headOffice: lang === 'en' ? 'Head Office' : 'મુખ્ય કાર્યાલય',
    officePhone: lang === 'en' ? 'Office Phone' : 'ઓફિસ ફોન',
    tagline: lang === 'en' ? 'With The Truth' : 'સત્યની સાથે',
  };

  return (
    <div className="w-[320px] h-[504px] bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden border flex flex-col justify-between p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-card via-card to-muted/50">
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
        <div className="text-xs text-muted-foreground">
          <p>346 rashmi south park</p>
          <p>Nr. Divine life school</p>
          <p>Opp.Karnavati 3 flats</p>
          <p>Narol, Gujarat</p>
        </div>
        <p className="text-xs mt-2 text-muted-foreground">
          <span className="font-semibold">{t.officePhone}:</span> +91 9773242022
        </p>
      </div>
      <div className="flex items-center justify-center relative">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto bg-white p-2 rounded-md">
            {reporterUrl && <QRCode
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
            />}
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
  );
}
