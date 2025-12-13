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
import { MoreHorizontal, Trash, Edit, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { deleteDocumentNonBlocking, setDocumentNonBlocking, useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { UserProfile } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Role = "member" | "reporter" | "editor" | "director";
const roles: Role[] = ["member", "reporter", "editor", "director"];

export default function UsersAdminPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const usersCollection = useMemoFirebase(() => (firestore ? collection(firestore, 'users') : null), [firestore]);
    const { data: users, isLoading, forceRefetch } = useCollection<UserProfile>(usersCollection);

    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const openEditDialog = (user: UserProfile) => {
        setEditingUser(user);
        setFirstName(user.firstName);
        setLastName(user.lastName);
    };

    const closeEditDialog = () => {
        setEditingUser(null);
        setFirstName('');
        setLastName('');
    };

    const handleUpdateUser = () => {
        if (!firestore || !editingUser || !firstName) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'First name is required.',
            });
            return;
        }

        const userDocRef = doc(firestore, 'users', editingUser.id);
        setDocumentNonBlocking(userDocRef, { firstName, lastName }, { merge: true });
        
        toast({
            title: 'User Updated',
            description: `${firstName} ${lastName}'s profile has been updated.`,
        });
        forceRefetch();
        closeEditDialog();
    };

    const handleDeleteUser = () => {
        if (!firestore || !deletingUser) return;
        const userDocRef = doc(firestore, 'users', deletingUser.id);
        const roleDocRef = doc(firestore, 'roles', deletingUser.id);

        deleteDocumentNonBlocking(userDocRef);
        deleteDocumentNonBlocking(roleDocRef);

        toast({
            title: 'User Deleted',
            description: `The data for ${deletingUser.email} has been deleted. Note: This does not remove them from Firebase Authentication.`,
        });
        forceRefetch();
        setDeletingUser(null);
    };

    const handleRoleChange = async (userId: string, newRole: Role) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', userId);
        const roleDocRef = doc(firestore, 'roles', userId);
        try {
            // Set role in both users and roles collection for consistency
            setDocumentNonBlocking(userDocRef, { role: newRole }, { merge: true });
            setDocumentNonBlocking(roleDocRef, { role: newRole }, { merge: true });
            toast({
                title: 'Role Updated',
                description: `User role has been set to ${newRole}.`,
            });
            forceRefetch();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error updating role',
                description: error.message,
            });
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>
    }

    return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all registered users and their roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.profilePictureUrl || `https://avatar.vercel.sh/${user.email}.png`} />
                            <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {user.firstName} {user.lastName}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                   <TableCell>
                      <Badge variant={user.role === 'director' ? 'default' : 'outline'} className="capitalize">
                        {user.role}
                      </Badge>
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
                        <DropdownMenuItem onSelect={() => openEditDialog(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Name</span>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Change Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuLabel>Set Role</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {roles.map(role => (
                                        <DropdownMenuItem key={role} onSelect={() => handleRoleChange(user.id, role)}>
                                            <span className="capitalize">{role}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => setDeletingUser(user)} className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingUser} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>Update the name for {editingUser?.email}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={closeEditDialog}>Cancel</Button>
                <Button onClick={handleUpdateUser}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingUser} onOpenChange={(isOpen) => !isOpen && setDeletingUser(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user's data from your Firestore database, but it will not remove their authentication record from Firebase Auth.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className={buttonVariants({ variant: "destructive" })}>
                Yes, delete user data
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
    );
}
