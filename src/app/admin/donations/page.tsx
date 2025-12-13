
'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { placeholderDonations } from "@/lib/placeholder-data";
  import { Badge } from "@/components/ui/badge";

  const RupeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 3h12"></path>
        <path d="M6 8h12"></path>
        <path d="m6 13 8.5 8"></path>
        <path d="M6 13h3"></path>
        <path d="M9 13c6.667 0 6.667-10 0-10"></path>
    </svg>
  );
  
  export default function DonationsAdminPage() {
    // Admin page for viewing donations
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
          <CardDescription>View and manage all donations to your platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.donorName}</TableCell>
                  <TableCell>
                    {donation.currency === 'INR' ? <RupeeIcon className="inline h-4 w-4 mr-1" /> : '$'}
                    {donation.amount.toLocaleString(`en-${donation.currency === 'INR' ? 'IN' : 'US'}`)}
                  </TableCell>
                  <TableCell>{donation.type}</TableCell>
                  <TableCell>{donation.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        donation.status === "Completed"
                          ? "default"
                          : donation.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        donation.status === "Completed" ? "bg-green-500/20 text-green-700 border-green-500/40" : 
                        donation.status === "Pending" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/40" : 
                        "bg-red-500/20 text-red-700 border-red-500/40"
                      }
                    >
                      {donation.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
