
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
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/use-user-role";

export default function TeamAdminPage() {
    const firestore = useFirestore();
    const { user: adminUser } = useUserRole();
    const usersCollection = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
    const { data: users } = useCollection(usersCollection);

    const handleRoleChange = (userId: string, newRole: string) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', userId);
        updateDocumentNonBlocking(userDocRef, { role: newRole });
    };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Team</CardTitle>
            <CardDescription>Manage your team of reporters and their credentials.</CardDescription>
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
                                <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!canChangeRole}>
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'member')}>Member</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'reporter')}>Reporter</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'editor')}>Editor</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'director')}>Director</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
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
