
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Heart, IndianRupee } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function DonatePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = React.use(params);
  const router = useRouter();
  const [amount, setAmount] = useState<number | string>(500);
  const [isCustom, setIsCustom] = useState(false);
  const customAmountRef = useRef<HTMLInputElement>(null);
  
  const inrAmounts = [250, 500, 1000, 2500];

  const handleAmountClick = (val: number) => {
    setIsCustom(false);
    setAmount(val);
  }

  const handleCustomClick = () => {
    setIsCustom(true);
    setAmount('');
  }

  useEffect(() => {
    if (isCustom) {
      customAmountRef.current?.focus();
    }
  }, [isCustom]);

  const handleDonateClick = () => {
    const finalAmount = Number(amount);
    if(finalAmount > 0) {
      router.push(`/${lang}/donate/pay?amount=${finalAmount}`);
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary/70"/>
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Support Independent Journalism</h1>
            <Heart className="w-8 h-8 text-primary/70"/>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
          Your contribution empowers us to bring you unbiased news and hold power to account. Every contribution, however big or small, is valuable for our future.
        </p>
      </div>

      <Card className="shadow-lg halo-effect">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Make a Donation with your <Heart className="inline w-6 h-6 text-red-500 fill-current"/> </CardTitle>
          <CardDescription>Choose an amount or enter a custom one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Select Amount (INR)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {inrAmounts.map(val => (
                  <Button key={val} variant={amount === val && !isCustom ? "default" : "outline"} size="lg" className="h-12 text-lg" onClick={() => handleAmountClick(val)}>
                    ₹{val}
                  </Button>
                ))}
                 <Button variant={isCustom ? "default" : "outline"} size="lg" className="h-12 text-lg" onClick={handleCustomClick}>
                    Other
                  </Button>
              </div>

              {isCustom && (
                 <div className="mt-6 space-y-2">
                    <Label htmlFor="custom-amount" className="font-semibold">Custom Amount (INR)</Label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            ref={customAmountRef}
                            id="custom-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-10 text-lg h-12"
                        />
                    </div>
                </div>
              )}
            </div>

             <Button className="w-full text-lg py-6" onClick={handleDonateClick} disabled={!amount || Number(amount) <= 0}>
                <IndianRupee className="mr-2 h-5 w-5" /> Donate ₹{Number(amount) > 0 ? amount : ''} with UPI
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
