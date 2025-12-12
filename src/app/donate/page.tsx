"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DollarSign, IndianRupee } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function DonatePage() {
  const [donationType, setDonationType] = useState<'onetime' | 'recurring'>('onetime');
  const [amount, setAmount] = useState<number>(500);
  const amounts = donationType === 'onetime' ? [100, 250, 500, 1000] : [50, 100, 250, 500];

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Support Independent Journalism</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your contribution empowers us to bring you unbiased news and hold power to account. Every contribution, however big or small, is valuable for our future.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Make a Donation</CardTitle>
          <CardDescription>Choose your preferred payment method and amount.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="india" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="india">For India (INR)</TabsTrigger>
              <TabsTrigger value="global">For Global (USD)</TabsTrigger>
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
                  <Button key={val} variant={amount === val ? "default" : "outline"} onClick={() => setAmount(val)}>
                    {val}
                  </Button>
                ))}
              </div>
            </div>

            <TabsContent value="india">
              <CardFooter>
                <Button className="w-full text-lg py-6">
                  <IndianRupee className="mr-2 h-5 w-5" /> Donate ₹{amount} with Razorpay
                </Button>
              </CardFooter>
            </TabsContent>
            <TabsContent value="global">
              <CardFooter className="flex-col sm:flex-row gap-4">
                <Button className="w-full text-lg py-6">
                  <DollarSign className="mr-2 h-5 w-5" /> Donate ${amount} with Stripe
                </Button>
                <Button className="w-full text-lg py-6" variant="secondary">
                  <DollarSign className="mr-2 h-5 w-5" /> Donate ${amount} with PayPal
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
