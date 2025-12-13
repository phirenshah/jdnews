
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
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
    DropdownMenuSeparator
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/use-user-role";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createReporter, deleteUser, updateUserRole } from "@/ai/flows/user-management";

export default function TeamAdminPage() {
    const { user: adminUser } = useUserRole();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const [isAddReporterDialogOpen, setIsAddReporterDialogOpen] = useState(false);
    const [newReporter, setNewReporter] = useState({
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        dob: '',
        officeLocation: '',
        profilePictureUrl: '',
    });

    const usersCollection = useMemoFirebase(
      () => collection(firestore, 'users'),
      [firestore]
    );

    const { data: users, isLoading: usersIsLoading } = useCollection(usersCollection);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUserRole({ userId, role: newRole });
            toast({
                title: "Role Updated",
                description: `User role has been successfully changed to ${newRole}.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: "Error updating role",
                description: error.message,
            });
        }
    };
    
    const handleDeleteUser = async (userId: string) => {
      if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
      
      try {
        await deleteUser({ userId });
        toast({
          title: "User Deleted",
          description: "The user has been successfully deleted.",
        });
      } catch (error: any) {
         toast({
            variant: 'destructive',
            title: "Error Deleting User",
            description: error.message,
        });
      }
    };

    const handleAddReporter = async () => {
        if(!newReporter.email) return;

        try {
          await createReporter(newReporter);
           toast({
                title: "Reporter Created",
                description: `${newReporter.firstName} ${newReporter.lastName} has been added.`,
            });
            setIsAddReporterDialogOpen(false);
            setNewReporter({
                firstName: '',
                lastName: '',
                email: '',
                title: '',
                dob: '',
                officeLocation: '',
                profilePictureUrl: '',
            });
        } catch(error: any) {
             toast({
                variant: 'destructive',
                title: "Error Creating Reporter",
                description: error.message,
            });
        }
    };
    

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Team</CardTitle>
            <CardDescription>Manage your team of reporters and their credentials.</CardDescription>
        </div>
         <div className="ml-auto flex items-center gap-2">
            <Dialog open={isAddReporterDialogOpen} onOpenChange={setIsAddReporterDialogOpen}>
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
                            Fill in the details to create a new reporter and their press card. An invitation email will be sent to them to set up their account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" value={newReporter.firstName} onChange={(e) => setNewReporter({...newReporter, firstName: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" value={newReporter.lastName} onChange={(e) => setNewReporter({...newReporter, lastName: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={newReporter.email} onChange={(e) => setNewReporter({...newReporter, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="e.g. Senior Correspondent" value={newReporter.title} onChange={(e) => setNewReporter({...newReporter, title: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" placeholder="DD/MM/YYYY" value={newReporter.dob} onChange={(e) => setNewReporter({...newReporter, dob: e.target.value})}/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="office">Office Location</Label>
                                <Input id="office" placeholder="e.g. Mumbai Bureau" value={newReporter.officeLocation} onChange={(e) => setNewReporter({...newReporter, officeLocation: e.target.value})} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="picture">Profile Picture URL</Label>
                            <Input id="picture" placeholder="https://..." value={newReporter.profilePictureUrl} onChange={(e) => setNewReporter({...newReporter, profilePictureUrl: e.target.value})} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleAddReporter}>Create Reporter</Button>
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
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: any) => {
                const canChangeRole = adminUser?.uid !== user.id;
                return (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                     <AvatarImage src={user.photoURL || `https://avatar.vercel.sh/${user.email}.png`} />
                                    <AvatarFallback>{user.firstName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {user.firstName} {user.lastName}
                            </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <Badge variant={user.role === 'director' ? 'default' : 'secondary'} className="capitalize">{user.role}</Badge>
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
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger disabled={!canChangeRole}>Change Role</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'member')}>Member</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'reporter')}>Reporter</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'editor')}>Editor</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'director')}>Director</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)} disabled={!canChangeRole}>Delete</DropdownMenuItem>
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
