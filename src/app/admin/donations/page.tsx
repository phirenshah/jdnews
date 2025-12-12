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
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: donation.currency,
                    }).format(donation.amount)}
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
  