"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone } from "lucide-react";
import { useState } from "react";

export default function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setSubmitted(true);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Megaphone className="w-8 h-8 text-primary/80" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            Advertise With Us
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
          Reach a dedicated audience of engaged readers. Fill out the form
          below to get in touch with our advertising team.
        </p>
      </div>

      <Card className="shadow-lg halo-effect">
        {submitted ? (
          <CardContent className="p-12 text-center">
            <CardTitle className="text-2xl font-headline mb-4">
              Thank You!
            </CardTitle>
            <p className="text-muted-foreground">
              Your advertising request has been submitted. Our team will review
              it and get back to you shortly.
            </p>
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">
                Advertising Inquiry
              </CardTitle>
              <CardDescription>
                Please provide details about your advertising needs.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g., +91 98765 43210"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Your Budget (INR)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="e.g., 50000"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic / Subject</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Product Launch Campaign"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Detailed Explanation</Label>
                  <Textarea
                    id="details"
                    placeholder="Describe your product, target audience, and campaign goals..."
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full text-lg py-6">
                  Send Request
                </Button>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
