
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
import { MoreHorizontal, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { useCollection, useFirestore } from "@/firebase";
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc } from "firebase/firestore";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function ReportersAdminPage() {
    const firestore = useFirestore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [title, setTitle] = useState("");
    const [bio, setBio] = useState("");
    const [profilePictureUrl, setProfilePictureUrl] = useState("");


    const authorsCollection = useMemo(
        () => collection(firestore, 'authors'),
        [firestore]
    );

    const { data: authors, isLoading } = useCollection(authorsCollection);
    
    const handleAddReporter = () => {
        if (!firstName || !lastName || !title) return;
        const newAuthor = {
            firstName,
            lastName,
            title,
            bio,
            profilePictureUrl,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@jdnews.com`,
            verified: false,
            joinedDate: new Date().toISOString().split('T')[0],
            articlesPublished: 0,
        };
        addDocumentNonBlocking(authorsCollection, newAuthor);
        setDialogOpen(false);
        setFirstName("");
        setLastName("");
        setTitle("");
        setBio("");
        setProfilePictureUrl("");
    };

    const handleVerificationChange = (authorId: string, verified: boolean) => {
      const authorRef = doc(firestore, 'authors', authorId);
      updateDocumentNonBlocking(authorRef, { verified });
    };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Team</CardTitle>
            <CardDescription>Manage your team of reporters and their credentials.</CardDescription>
        </div>
        <div className="ml-auto">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Reporter
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Add New Reporter</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new reporter to your team.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">First Name</Label>
                            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. John" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">Last Name</Label>
                            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Doe" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Correspondent" className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">Bio</Label>
                            <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio" className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="profilePictureUrl" className="text-right">Picture URL</Label>
                            <Input id="profilePictureUrl" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} placeholder="https://..." className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                    <Button onClick={handleAddReporter}>Save reporter</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors?.map((reporter: any) => {
                return (
                    <TableRow key={reporter.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    {reporter.profilePictureUrl && <AvatarImage src={reporter.profilePictureUrl} alt={reporter.firstName} />}
                                    <AvatarFallback>{reporter.firstName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {reporter.firstName} {reporter.lastName}
                            </div>
                        </TableCell>
                        <TableCell>{reporter.title}</TableCell>
                        <TableCell>{reporter.joinedDate}</TableCell>
                        <TableCell>{reporter.articlesPublished}</TableCell>
                        <TableCell>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`verified-switch-${reporter.id}`}
                                    checked={reporter.verified}
                                    onCheckedChange={(checked) => handleVerificationChange(reporter.id, checked)}
                                />
                                <Label htmlFor={`verified-switch-${reporter.id}`}>
                                <Badge variant={reporter.verified ? "default" : "secondary"}>
                                    {reporter.verified ? 
                                    <><CheckCircle className="w-3 h-3 mr-1"/>Verified</> : 
                                    <><XCircle className="w-3 h-3 mr-1"/>Unverified</>}
                                </Badge>
                                </Label>
                            </div>
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
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
