
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DollarSign, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";

const RupeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 3h12"></path>
        <path d="M6 8h12"></path>
        <path d="m6 13 8.5 8"></path>
        <path d="M6 13h3"></path>
        <path d="M9 13c6.667 0 6.667-10 0-10"></path>
    </svg>
);


export default function DonatePage() {
  const [donationType, setDonationType] = useState<'onetime' | 'recurring'>('onetime');
  const [amount, setAmount] = useState<number>(500);
  const [currency, setCurrency] = useState<'inr' | 'usd'>('inr');

  const inrAmounts = donationType === 'onetime' ? [250, 500, 1000, 2500] : [100, 250, 500, 1000];
  const usdAmounts = donationType === 'onetime' ? [10, 25, 50, 100] : [5, 10, 25, 50];

  const handleTabChange = (value: string) => {
    const newCurrency = value as 'inr' | 'usd';
    setCurrency(newCurrency);
    // Reset amount to default for the new currency
    setAmount(newCurrency === 'inr' ? 500 : 50);
  };
  
  const amounts = currency === 'inr' ? inrAmounts : usdAmounts;
  const currencySymbol = currency === 'inr' ? <RupeeIcon className="inline h-5 w-5 -ml-1" /> : '$';
  const currencyIcon = currency === 'inr' ? <RupeeIcon className="mr-2 h-5 w-5" /> : <DollarSign className="mr-2 h-5 w-5" />;


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
          <CardDescription>Choose your preferred payment method and amount.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inr" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inr">For India (INR)</TabsTrigger>
              <TabsTrigger value="usd">For Global (USD)</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Select Donation Type</h3>
              <RadioGroup defaultValue="onetime" className="flex space-x-4 mb-6" onValueChange={(val) => setDonationType(val as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onetime" id="onetime" />
                  <Label htmlFor="onetime">One-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring">Recurring Monthly</Label>
                </div>
              </RadioGroup>

              <h3 className="font-semibold mb-4">Select Amount</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {amounts.map(val => (
                  <Button key={val} variant={amount === val ? "default" : "outline"} size="lg" className="h-12 text-lg" onClick={() => setAmount(val)}>
                    <span className="flex items-center">{currencySymbol}{val}</span>
                  </Button>
                ))}
              </div>
            </div>

            <TabsContent value="inr">
              <CardFooter>
                <Button className="w-full text-lg py-6">
                  {currencyIcon} Donate <span className="flex items-center ml-1">{currencySymbol}{amount}</span> with Razorpay
                </Button>
              </CardFooter>
            </TabsContent>
            <TabsContent value="usd">
              <CardFooter className="flex-col sm:flex-row gap-4">
                <Button className="w-full text-lg py-6">
                  {currencyIcon} Donate <span className="flex items-center ml-1">{currencySymbol}{amount}</span> with Stripe
                </Button>
                <Button className="w-full text-lg py-6" variant="secondary">
                   {currencyIcon} Donate <span className="flex items-center ml-1">{currencySymbol}{amount}</span> with PayPal
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
