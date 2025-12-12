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
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { Phone, MessageSquare, DollarSign } from "lucide-react";
  
  // This would come from a database in a real application
  const placeholderAdRequests = [
    {
      id: "ad-req-1",
      topic: "New Smartphone Launch",
      phoneNumber: "+1-202-555-0176",
      budget: 10000,
      details: "We are launching a new smartphone and want to target tech-savvy readers in major metro areas. Campaign to run for 2 weeks.",
      status: "Pending",
      date: "2024-07-29",
    },
    {
      id: "ad-req-2",
      topic: "Local Restaurant Opening",
      phoneNumber: "+91 98765 43210",
      budget: 2500,
      details: "Grand opening of a new Italian restaurant in downtown. Looking for a full-page feature.",
      status: "Contacted",
      date: "2024-07-28",
    },
    {
      id: "ad-req-3",
      topic: "E-commerce Summer Sale",
      phoneNumber: "+44 20 7946 0958",
      budget: 7500,
      details: "Annual summer sale event. Need banner ads across the website for the month of August.",
      status: "Pending",
      date: "2024-07-28",
    },
    {
      id: "ad-req-4",
      topic: "Financial Services Webinar",
      phoneNumber: "+1-312-555-0199",
      budget: 15000,
      details: "Promoting a webinar on investment strategies for young professionals. Need sponsored content and email blast.",
      status: "Closed",
      date: "2024-07-25",
    },
  ];
  
  export default function AdvertiseAdminPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advertising Requests</CardTitle>
          <CardDescription>
            Review and manage incoming advertising inquiries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Budget (USD)</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderAdRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.date}</TableCell>
                  <TableCell className="max-w-xs truncate">{req.topic}</TableCell>
                  <TableCell>
                    ${req.budget.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${req.phoneNumber}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </a>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        req.status === "Pending" ? "secondary" : 
                        req.status === "Contacted" ? "default" : "outline"
                      }
                      className={
                        req.status === "Pending" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/40" : 
                        req.status === "Contacted" ? "bg-blue-500/20 text-blue-700 border-blue-500/40" : ""
                      }
                    >
                      {req.status}
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
  