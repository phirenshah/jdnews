
'use client';
import { useSearchParams } from 'next/navigation';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import * as React from 'react';

const RupeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 3h12"></path>
        <path d="M6 8h12"></path>
        <path d="m6 13 8.5 8"></path>
        <path d="M6 13h3"></path>
        <path d="M9 13c6.667 0 6.667-10 0-10"></path>
    </svg>
);

export default function DonatePayPage() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '0';
  const upiId = "vijayparmar231194-2@okaxis";
  const upiUrl = `upi://pay?pa=${upiId}&pn=JD%20NEWS&am=${amount}&tn=Donation&cu=INR`;

  return (
    <div className="container max-w-md mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full shadow-xl text-center halo-effect">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Scan to Donate</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg border">
                <QRCode
                    value={upiUrl}
                    size={256}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="Q"
                />
            </div>
             <div className="text-center">
                 <p className="font-semibold text-lg flex items-center">Amount: <RupeeIcon className="inline h-5 w-5 mx-1" />{amount}</p>
                 <p className="text-muted-foreground text-sm">UPI ID: {upiId}</p>
             </div>
             <div className="text-center text-sm text-muted-foreground pt-4">
                 <p>Scan and pay with any BHIM UPI app</p>
                 <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
                    <Image src="https://www.labnol.org/_astro/bhim.ADxokklY.svg" alt="BHIM" width={60} height={24} />
                    <Image src="https://www.labnol.org/_astro/gpay.U0cS9ieh.svg" alt="Google Pay" width={60} height={24} />
                    <Image src="https://www.labnol.org/_astro/phonepe.DFx5MJ55.svg" alt="PhonePe" width={70} height={24} />
                    <Image src="https://www.labnol.org/_astro/paytm.8ubvN9kE.svg" alt="Paytm" width={70} height={24} />
                    <Image src="https://www.labnol.org/_astro/amazon.dU4waQXi.svg" alt="Amazon Pay" width={70} height={24} />
                 </div>
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
