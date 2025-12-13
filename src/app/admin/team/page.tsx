
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
import { MoreHorizontal, PlusCircle, Trash, Camera, Upload } from "lucide-react";
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
import { useUserRole } from "@/hooks/use-user-role";
import { useFirebase, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TeamAdminPage() {
    const { user: adminUser, role: adminRole, isLoading: isRoleLoading } = useUserRole();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const isAdmin = adminRole === 'director';

    const usersCollection = useMemoFirebase(() => {
        if (firestore && isAdmin) {
            return collection(firestore, 'users');
        }
        return null;
    }, [firestore, isAdmin]);
    
    const { data: users, isLoading: areUsersLoading } = useCollection(usersCollection);

    const [isAddReporterDialogOpen, setIsAddReporterDialogOpen] = useState(false);
    const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
    const [newReporter, setNewReporter] = useState({
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        dob: '',
        officeLocation: '',
        profilePictureUrl: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    const authorsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'authors') : null, [firestore]);
    
    const resetForm = () => {
        setNewReporter({
            firstName: '', lastName: '', email: '', title: '', dob: '',
            officeLocation: '', profilePictureUrl: '',
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], "capture.png", { type: "image/png" });
                    setImageFile(file);
                    setImagePreview(canvas.toDataURL('image/png'));
                }
            }, 'image/png');
            setIsCameraDialogOpen(false);
        }
    };

    const handleAddReporter = async () => {
        if(!newReporter.email || !authorsCollection || !firestore) return;

        let uploadedImageUrl = '';
        if (imageFile) {
            try {
                const formData = new FormData();
                formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY!);
                formData.append('image', imageFile);

                const response = await axios.post('https://api.imgbb.com/1/upload', formData);
                uploadedImageUrl = response.data.data.url;
            } catch (error) {
                console.error("Image upload failed:", error);
                toast({
                    variant: 'destructive',
                    title: 'Image Upload Failed',
                    description: 'Could not upload the profile picture. Please try again.',
                });
                return;
            }
        }

        try {
            const authorData = {
              id: '',
              name: `${newReporter.firstName} ${newReporter.lastName}`,
              title: newReporter.title,
              dob: newReporter.dob,
              contact: newReporter.email,
              officeLocation: newReporter.officeLocation,
              verified: true,
              profilePictureUrl: uploadedImageUrl,
            };

            const userDocRef = doc(firestore, 'users', newReporter.email); 
            const roleDocRef = doc(firestore, 'roles_admin', newReporter.email);

            await setDocumentNonBlocking(userDocRef, {
                email: newReporter.email,
                firstName: newReporter.firstName,
                lastName: newReporter.lastName,
                role: 'reporter',
            }, { merge: true });

            const docRef = await addDocumentNonBlocking(authorsCollection, authorData);
            await setDocumentNonBlocking(docRef, { id: docRef.id }, { merge: true });
            
            toast({
                title: "Reporter Created",
                description: `${newReporter.firstName} ${newReporter.lastName} has been added as an author.`,
            });
            resetForm();
            setIsAddReporterDialogOpen(false);
        } catch(error: any) {
             toast({
                variant: 'destructive',
                title: "Error Creating Reporter",
                description: error.message,
            });
        }
    };
    
    const handleRoleChange = async (userId: string, newRole: string) => {
      if (!firestore || !userId) return;
      const userDocRef = doc(firestore, 'users', userId);
      setDocumentNonBlocking(userDocRef, { role: newRole }, { merge: true });
      if (newRole === 'director') {
        const adminRoleDocRef = doc(firestore, 'roles_admin', userId);
        setDocumentNonBlocking(adminRoleDocRef, {}, { merge: true });
      } else {
        const adminRoleDocRef = doc(firestore, 'roles_admin', userId);
        deleteDocumentNonBlocking(adminRoleDocRef);
      }
      toast({
        title: "Role Updated",
        description: `User role has been changed to ${newRole}.`,
      });
    };

    const handleDeleteUser = (userId: string, email?: string) => {
        if (!firestore || !userId) return;
        const userDocRef = doc(firestore, 'users', userId);
        deleteDocumentNonBlocking(userDocRef);
        const adminRoleDocRef = doc(firestore, 'roles_admin', userId);
        deleteDocumentNonBlocking(adminRoleDocRef);
        toast({
            title: "User Data Deleted",
            description: `User ${email} has been removed. Note: Auth account still exists.`,
        });
    };

    useEffect(() => {
        if (isCameraDialogOpen) {
            const getCameraPermission = async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({video: true});
                setHasCameraPermission(true);
        
                if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                }
              } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                  variant: 'destructive',
                  title: 'Camera Access Denied',
                  description: 'Please enable camera permissions in your browser settings.',
                });
              }
            };
            getCameraPermission();
        } else {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [isCameraDialogOpen, toast]);

    const isLoading = isRoleLoading || areUsersLoading;

  return (
    <>
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
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Add New Reporter</DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new reporter profile.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-4">
                            <Label>Profile Photo</Label>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    {imagePreview && <AvatarImage src={imagePreview} />}
                                    <AvatarFallback className="text-3xl">?</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-2">
                                     <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Choose from Gallery
                                    </Button>
                                    <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                                    <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline"><Camera className="mr-2 h-4 w-4" />Capture with Camera</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Camera</DialogTitle>
                                            </DialogHeader>
                                            <div className="relative">
                                                <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                                                {hasCameraPermission === false && (
                                                    <Alert variant="destructive" className="mt-4">
                                                        <AlertTitle>Camera Access Required</AlertTitle>
                                                        <AlertDescription>Please allow camera access to use this feature.</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>
                                            <canvas ref={canvasRef} className="hidden" />
                                            <DialogFooter>
                                                <Button onClick={handleCameraCapture} disabled={!hasCameraPermission}>Take Picture</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>

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
                            <Label htmlFor="email">Email (must match login email for role)</Label>
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
                {isLoading && <TableRow><TableCell colSpan={4}>Loading users...</TableCell></TableRow>}
                {!isLoading && users?.map((user: any) => {
                    const canChangeRole = adminUser?.uid !== user.id;
                    return (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.profilePictureUrl || `https://avatar.vercel.sh/${user.email}.png`} />
                                        <AvatarFallback>{user.firstName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {user.firstName} {user.lastName}
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'director' ? 'default' : user.role === 'editor' ? 'secondary' : 'outline'} className="capitalize">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!canChangeRole}>
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                {canChangeRole && <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onSelect={() => handleRoleChange(user.id, 'member')}>Member</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleRoleChange(user.id, 'reporter')}>Reporter</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleRoleChange(user.id, 'editor')}>Editor</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleRoleChange(user.id, 'director')}>Director</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onSelect={() => handleDeleteUser(user.id, user.email)}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        <span>Delete User</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>}
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
