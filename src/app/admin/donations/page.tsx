
'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
  
  export default function DonationsAdminPage() {
    // Admin page for viewing donations
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
          <CardDescription>View and manage all donations to your platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <DollarSign className="w-16 h-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">Donation Management Coming Soon</h3>
            <p className="mt-2 text-sm text-muted-foreground">This section is under construction.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
