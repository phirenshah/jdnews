
'use client';
import { useSearchParams } from 'next/navigation';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import * as React from 'react';

export default function DonatePayPage() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '0';
  const upiId = "vijayparmar231194-2@okaxis";
  const upiUrl = `upi://pay?pa=${upiId}&pn=JD%20NEWS&am=${amount}&tn=Donation&cu=INR`;
  const params = useSearchParams(); // This is already available, no need to call it again.

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
                 <p className="font-semibold text-lg">Amount: ₹{amount}</p>
                 <p className="text-muted-foreground text-sm">UPI ID: {upiId}</p>
             </div>
             <div className="text-center text-sm text-muted-foreground pt-4">
                 <p>Scan and pay with any BHIM UPI app</p>
                 <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
                    <Image src="https://www.labnol.org/_astro/bhim.ADxokklY.svg" alt="BHIM" width={60} height={24} />
                    <Image src="https://i.ibb.co/N2cMhS6/gpay.png" alt="Google Pay" width={60} height={24} />
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
