
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
import { MoreHorizontal, PlusCircle, Trash, Edit, RefreshCw, Loader2, Upload, Camera } from "lucide-react";
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
import { useState, useEffect, useMemo, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { collection, doc, query, where } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking, useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import type { Reporter, UserProfile } from "@/lib/definitions";
import Image from "next/image";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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
    const { data: users, isLoading: areUsersLoading, forceRefetch: refetchUsers } = useCollection<UserProfile>(usersCollection);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [reporterTitle, setReporterTitle] = useState('');
    const [reporterDob, setReporterDob] = useState('');
    const [reporterOffice, setReporterOffice] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);


    const availableUsers = useMemo(() => {
        if (!users || !authors) return users;
        const authorEmails = new Set(authors.map(author => author.contact.toLowerCase()));
        return users.filter(user => !authorEmails.has(user.email.toLowerCase()));
    }, [users, authors]);

    useEffect(() => {
        if (selectedUser) {
            setFirstName(selectedUser.firstName || '');
            setLastName(selectedUser.lastName || '');
            setImagePreview(selectedUser.profilePictureUrl || `https://avatar.vercel.sh/${selectedUser.email}.png`);
        }
    }, [selectedUser]);
    

    const handleAddReporter = async () => {
        if (!firestore || !selectedUser || !reporterTitle || !firstName) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please select a user, provide a title, and ensure first name is filled.',
            });
            return;
        }

        let finalImageUrl = selectedUser.profilePictureUrl || `https://avatar.vercel.sh/${selectedUser.email}.png`;

        if (imageFile) {
             try {
                const formData = new FormData();
                formData.append('key', "3f5f08b61f4298484f11df25a094c176"); // Use a public key or from env
                formData.append('image', imageFile);

                const response = await axios.post('https://api.imgbb.com/1/upload', formData);
                finalImageUrl = response.data.data.url;
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

        const authorId = selectedUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/gi, '-');
        const newName = `${firstName} ${lastName}`.trim();

        const newAuthorData: Partial<Reporter> = {
            id: authorId,
            name: newName,
            title: reporterTitle,
            contact: selectedUser.email,
            dob: reporterDob,
            officeLocation: reporterOffice,
            verified: true,
            profilePictureUrl: finalImageUrl
        };

        if (authorsCollection) {
            const newAuthorRef = doc(authorsCollection, authorId);
            setDocumentNonBlocking(newAuthorRef, newAuthorData, { merge: true });

            const userDocRef = doc(firestore, 'users', selectedUser.id);
            setDocumentNonBlocking(userDocRef, { firstName, lastName, profilePictureUrl: finalImageUrl }, { merge: true });

            toast({
                title: 'Reporter Added',
                description: `${newName} has been added to the team.`,
            });
            resetAddDialog();
            refetchAuthors();
            refetchUsers();
        }
    };
    
    const handleDeleteReporter = (authorId: string) => {
        if (!firestore) return;
        const authorDoc = doc(firestore, 'authors', authorId);
        deleteDocumentNonBlocking(authorDoc);
        toast({ title: 'Reporter Removed' });
        refetchAuthors();
        refetchUsers();
    };

    const resetAddDialog = () => {
        setIsAddDialogOpen(false);
        setSelectedUser(null);
        setReporterTitle('');
        setReporterDob('');
        setReporterOffice('');
        setFirstName('');
        setLastName('');
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
                <DialogContent className="sm:max-w-[625px]">
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
                                    {availableUsers?.map(user => (
                                        <DropdownMenuItem key={user.id} onSelect={() => setSelectedUser(user)}>
                                            {user.firstName} {user.lastName} ({user.email})
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        
                         {selectedUser && (
                            <>
                                <div className="space-y-2">
                                    <Label>Profile Picture</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Profile preview" width={96} height={96} className="object-cover h-24 w-24" />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Preview</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload
                                            </Button>
                                            <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                                            <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm"><Camera className="mr-2 h-4 w-4" />Take</Button>
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
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                </div>
                            </>
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
