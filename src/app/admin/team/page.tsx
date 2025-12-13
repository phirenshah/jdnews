
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
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { collection, doc, query, where } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking, useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import type { Reporter, UserProfile } from "@/lib/definitions";


const reporterTitles = [
    'Reporter',
    'Senior Reporter',
    'Editor',
    'Director',
    'Senior Political Correspondent',
    'Technology Editor',
    'Sports Journalist',
    'Investigative Reporter'
];

export default function TeamAdminPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();

    // Fetch existing authors from the 'authors' collection
    const authorsCollection = useMemoFirebase(() => (firestore ? collection(firestore, 'authors') : null), [firestore]);
    const { data: authors, isLoading: areAuthorsLoading, forceRefetch: refetchAuthors } = useCollection<Reporter>(authorsCollection);
    
    // Fetch all users to populate the "Add Reporter" dialog
    const usersCollection = useMemoFirebase(() => (firestore ? collection(firestore, 'users') : null), [firestore]);
    const { data: users, isLoading: areUsersLoading } = useCollection<UserProfile>(usersCollection);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [reporterTitle, setReporterTitle] = useState('');
    const [reporterDob, setReporterDob] = useState('');
    const [reporterOffice, setReporterOffice] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        if (selectedUser) {
            setFirstName(selectedUser.firstName || '');
            setLastName(selectedUser.lastName || '');
        }
    }, [selectedUser]);
    

    const handleAddReporter = () => {
        if (!firestore || !selectedUser || !reporterTitle || !firstName) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please select a user, provide a title, and ensure first name is filled.',
            });
            return;
        }

        // Check if the user is already an author
        const isAlreadyAuthor = authors?.some(author => author.contact === selectedUser.email);
        if(isAlreadyAuthor) {
            toast({
                variant: 'destructive',
                title: 'User is already an author',
                description: `${selectedUser.firstName} is already in the team.`
            });
            return;
        }

        const authorId = selectedUser.email.split('@')[0].toLowerCase();
        const newName = `${firstName} ${lastName}`.trim();

        const newAuthorData: Partial<Reporter> = {
            id: authorId,
            name: newName,
            title: reporterTitle,
            contact: selectedUser.email,
            dob: reporterDob,
            officeLocation: reporterOffice,
            verified: true,
            profilePictureUrl: selectedUser.profilePictureUrl || `https://avatar.vercel.sh/${selectedUser.email}.png`
        };

        if (authorsCollection) {
            const newAuthorRef = doc(authorsCollection, authorId);
            setDocumentNonBlocking(newAuthorRef, newAuthorData, { merge: true });

            // Also update the user's name in the users collection
            const userDocRef = doc(firestore, 'users', selectedUser.id);
            setDocumentNonBlocking(userDocRef, { firstName, lastName }, { merge: true });

            toast({
                title: 'Reporter Added',
                description: `${newName} has been added to the team.`,
            });
            resetAddDialog();
            refetchAuthors();
        }
    };
    
    const handleDeleteReporter = (authorId: string) => {
        if (!firestore) return;
        const authorDoc = doc(firestore, 'authors', authorId);
        deleteDocumentNonBlocking(authorDoc);
        toast({ title: 'Reporter Removed' });
        refetchAuthors();
    };

    const resetAddDialog = () => {
        setIsAddDialogOpen(false);
        setSelectedUser(null);
        setReporterTitle('');
        setReporterDob('');
        setReporterOffice('');
        setFirstName('');
        setLastName('');
    };

    if (areAuthorsLoading || areUsersLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>
    }

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Team</CardTitle>
            <CardDescription>Manage your team of reporters and their credentials.</CardDescription>
        </div>
         <div className="ml-auto flex items-center gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Reporter
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Reporter</DialogTitle>
                        <DialogDescription>
                            Select a user from your system to promote them to a reporter role.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select User</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.email})` : 'Select a user...'}
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                    {users?.map(user => (
                                        <DropdownMenuItem key={user.id} onSelect={() => setSelectedUser(user)}>
                                            {user.firstName} {user.lastName} ({user.email})
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                         {selectedUser && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                        )}

                         <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {reporterTitle || 'Select a title...'}
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                    {reporterTitles.map(title => (
                                        <DropdownMenuItem key={title} onSelect={() => setReporterTitle(title)}>
                                            {title}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" type="date" value={reporterDob} onChange={(e) => setReporterDob(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="office">Office Location</Label>
                                <Input id="office" value={reporterOffice} onChange={(e) => setReporterOffice(e.target.value)} placeholder="e.g. Mumbai Bureau" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={resetAddDialog}>Cancel</Button>
                        <Button onClick={handleAddReporter}>Add Reporter</Button>
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
                <TableHead>Email/Contact</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {authors?.map((reporter) => {
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
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onSelect={() => handleDeleteReporter(reporter.id)}
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
