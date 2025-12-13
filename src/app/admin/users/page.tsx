
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
import { setDocumentNonBlocking, useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { UserProfile } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";

type Role = "member" | "reporter" | "editor" | "director";
const roles: Role[] = ["member", "reporter", "editor", "director"];

export default function UsersAdminPage() {
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const usersCollection = useMemoFirebase(() => (firestore ? collection(firestore, 'users') : null), [firestore]);
    const { data: users, isLoading, forceRefetch } = useCollection<UserProfile>(usersCollection);

    const handleRoleChange = async (userId: string, newRole: Role) => {
        if (!firestore) return;
        const roleDocRef = doc(firestore, 'roles', userId);
        try {
            setDocumentNonBlocking(roleDocRef, { role: newRole }, { merge: true });
            toast({
                title: 'Role Updated',
                description: `User role has been set to ${newRole}.`,
            });
            // Note: A full implementation might need to refetch user data or manage state differently.
            // For now, a UI refresh would show the change.
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
                        <DropdownMenuItem disabled className="text-destructive">
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
    );
}
