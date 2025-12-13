
'use client';

import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, PlusCircle, Trash, Edit, RefreshCw, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
    DropdownMenuSeparator,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { placeholderReporters } from "@/lib/placeholder-data";


export default function TeamAdminPage() {
    const { toast } = useToast();

    const [team, setTeam] = useState(placeholderReporters);

    const handleDeleteUser = (userId: string) => {
        setTeam(prev => prev.filter(r => r.id !== userId));
        toast({
            title: "Reporter 'Deleted'",
            description: "This is a mock action. The underlying static data has not changed.",
        });
    };

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Team</CardTitle>
            <CardDescription>Manage your team of reporters and their credentials.</CardDescription>
        </div>
         <div className="ml-auto flex items-center gap-2">
            <Button disabled>
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Credits
            </Button>
            <Button disabled>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Reporter
            </Button>
        </div>
      </CardHeader>
      <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email/Contact</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {team.map((reporter) => {
                    return (
                        <TableRow key={reporter.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={reporter.profilePictureUrl} />
                                        <AvatarFallback>{reporter.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {reporter.name}
                                </div>
                            </TableCell>
                            <TableCell>{reporter.contact}</TableCell>
                            <TableCell>
                                <Badge variant={'outline'} className="capitalize">{reporter.title}</Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem disabled>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit User
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onSelect={() => handleDeleteUser(reporter.id)}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )})}
            </TableBody>
            </Table>
      </CardContent>
    </Card>
    </>
  );
}
