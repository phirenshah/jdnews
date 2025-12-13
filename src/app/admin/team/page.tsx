
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
import { MoreHorizontal, PlusCircle, Trash, Camera, Upload, Loader2 } from "lucide-react";
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
import { collection, doc, query, where, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
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

    const [findUserEmail, setFindUserEmail] = useState('');
    const [isFindingUser, setIsFindingUser] = useState(false);
    const [foundUser, setFoundUser] = useState<any>(null);
    const [findUserError, setFindUserError] = useState<string | null>(null);

    const [newReporter, setNewReporter] = useState({
        title: '',
        dob: '',
        officeLocation: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    const authorsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'authors') : null, [firestore]);
    
    const resetForm = () => {
        setNewReporter({ title: '', dob: '', officeLocation: '' });
        setFindUserEmail('');
        setFoundUser(null);
        setFindUserError(null);
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

    const handleFindUser = async () => {
        if (!firestore || !findUserEmail) return;
        
        setIsFindingUser(true);
        setFindUserError(null);
        setFoundUser(null);

        const usersQuery = query(collection(firestore, 'users'), where("email", "==", findUserEmail));
        
        try {
            const querySnapshot = await getDocs(usersQuery);
            if (querySnapshot.empty) {
                setFindUserError(`No user found with email: ${findUserEmail}. Please ask them to sign up first.`);
            } else {
                const userDoc = querySnapshot.docs[0];
                setFoundUser({ id: userDoc.id, ...userDoc.data() });
            }
        } catch (error) {
            setFindUserError("An error occurred while searching for the user.");
        } finally {
            setIsFindingUser(false);
        }
    };

    const handleAddReporter = async () => {
        if(!foundUser || !authorsCollection || !firestore) return;

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
              name: `${foundUser.firstName} ${foundUser.lastName}`,
              title: newReporter.title,
              dob: newReporter.dob,
              contact: foundUser.email,
              officeLocation: newReporter.officeLocation,
              verified: true,
              profilePictureUrl: uploadedImageUrl,
              imageId: `reporter-${foundUser.id}`
            };

            const userDocRef = doc(firestore, 'users', foundUser.id);
            const roleDocRef = doc(firestore, 'roles', foundUser.id);

            setDocumentNonBlocking(userDocRef, {
                role: 'reporter',
                profilePictureUrl: uploadedImageUrl,
            }, { merge: true });

            setDocumentNonBlocking(roleDocRef, { role: 'reporter' }, { merge: true });
            
            if (newReporter.title === 'Director') {
                const adminRoleDocRef = doc(firestore, 'roles_admin', foundUser.id);
                setDocumentNonBlocking(adminRoleDocRef, {}, { merge: true });
            }

            const docRef = await addDocumentNonBlocking(authorsCollection, authorData);
            if (docRef) {
                setDocumentNonBlocking(docRef, { id: docRef.id }, { merge: true });
            }
            
            toast({
                title: "Reporter Created",
                description: `${foundUser.firstName} ${foundUser.lastName} has been added as a reporter.`,
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
        const roleDocRef = doc(firestore, 'roles', userId);
        
        setDocumentNonBlocking(userDocRef, { role: newRole }, { merge: true });
        setDocumentNonBlocking(roleDocRef, { role: newRole }, { merge: true });
      
        if (newRole === 'director') {
          const adminRoleDocRef = doc(firestore, 'roles_admin', userId);
          setDocumentNonBlocking(adminRoleDocRef, {}, { merge: true });
        } else {
          // Check if user being demoted is the current admin
          if (adminUser?.uid === userId) {
             toast({
                variant: 'destructive',
                title: "Action Not Allowed",
                description: "You cannot demote yourself from the Director role.",
            });
            return;
          }
          const adminRoleDocRef = doc(firestore, 'roles_admin', userId);
          deleteDocumentNonBlocking(adminRoleDocRef);
        }
        toast({
          title: "Role Updated",
          description: `User role has been changed to ${newRole}.`,
        });
      };
  
      const handleDeleteUser = async (userId: string, email?: string) => {
          if (!firestore || !userId) return;
          
          if (adminUser?.uid === userId) {
            toast({
                variant: 'destructive',
                title: "Action Not Allowed",
                description: "You cannot delete your own account from the admin panel.",
            });
            return;
          }
  
          if (email && authorsCollection) {
            const authorsQuery = query(authorsCollection, where('contact', '==', email));
            const authorDocs = await getDocs(authorsQuery);
            authorDocs.forEach(authorDoc => {
                deleteDocumentNonBlocking(authorDoc.ref);
            });
          }
  
          deleteDocumentNonBlocking(doc(firestore, 'users', userId));
          deleteDocumentNonBlocking(doc(firestore, 'roles', userId));
          deleteDocumentNonBlocking(doc(firestore, 'roles_admin', userId));
  
          toast({
              title: "User Data Deleted",
              description: `User ${email} has been removed from Firestore. Note: Auth account still exists.`,
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
            <Dialog open={isAddReporterDialogOpen} onOpenChange={(isOpen) => { setIsAddReporterDialogOpen(isOpen); if (!isOpen) resetForm(); }}>
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
                            Find an existing user by email to promote them to a reporter role.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {!foundUser ? (
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="find-email">User's Login Email</Label>
                                <div className="flex gap-2">
                                    <Input id="find-email" type="email" value={findUserEmail} onChange={(e) => setFindUserEmail(e.target.value)} placeholder="user@example.com"/>
                                    <Button onClick={handleFindUser} disabled={isFindingUser || !findUserEmail}>
                                        {isFindingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find User"}
                                    </Button>
                                </div>
                            </div>
                            {findUserError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{findUserError}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    ) : (
                        <>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-4">
                                <Label>Profile Photo</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={imagePreview || foundUser.profilePictureUrl} />
                                        <AvatarFallback className="text-3xl">{foundUser.firstName?.charAt(0)}</AvatarFallback>
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
                                                <DialogHeader><DialogTitle>Camera</DialogTitle></DialogHeader>
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
                                    <Label>First Name</Label>
                                    <Input value={foundUser.firstName} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input value={foundUser.lastName} disabled />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={foundUser.email} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" placeholder="e.g. Senior Correspondent" value={newReporter.title} onChange={(e) => setNewReporter({...newReporter, title: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" placeholder="DD/MM/YYYY" value={newReporter.dob} onChange={(e) => setNewReporter({...newReporter, dob: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="office">Office Location</Label>
                                    <Input id="office" placeholder="e.g. Mumbai Bureau" value={newReporter.officeLocation} onChange={(e) => setNewReporter({...newReporter, officeLocation: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={resetForm}>Back</Button>
                            <Button type="submit" onClick={handleAddReporter}>Create Reporter</Button>
                        </DialogFooter>
                        </>
                    )}
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
                {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading users...</TableCell></TableRow>}
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
