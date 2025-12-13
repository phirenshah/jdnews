
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
import { MoreHorizontal, PlusCircle, Upload, Camera } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useState, useRef, useEffect } from "react";
import { collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useAuth } from "@/firebase/auth/use-user";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import axios from "axios";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ArticlesAdminPage() {
    const firestore = useFirestore();
    const { user } = useAuth();
    const { toast } = useToast();
    const articlesCollection = useMemoFirebase(() => collection(firestore, 'articles'), [firestore]);
    const { data: articles, forceRefetch } = useCollection(articlesCollection);

    const [titleEnglish, setTitleEnglish] = useState('');
    const [titleGujarati, setTitleGujarati] = useState('');
    const [contentEnglish, setContentEnglish] = useState('');
    const [contentGujarati, setContentGujarati] = useState('');
    const [excerptEnglish, setExcerptEnglish] = useState('');
    const [excerptGujarati, setExcerptGujarati] = useState('');
    const [category, setCategory] = useState('');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    
    const resetForm = () => {
        setTitleEnglish('');
        setTitleGujarati('');
        setContentEnglish('');
        setContentGujarati('');
        setExcerptEnglish('');
        setExcerptGujarati('');
        setCategory('');
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

    const handlePublish = async () => {
        if (!user || !articlesCollection) return;
        
        let finalImageUrl = '';

        if(imageFile) {
            try {
              const formData = new FormData();
              formData.append('key', "3f5f08b61f4298484f11df25a094c176");
              formData.append('image', imageFile);
    
              const response = await axios.post('https://api.imgbb.com/1/upload', formData);
              finalImageUrl = response.data.data.url;
            } catch (error) {
                console.error("Image upload failed:", error);
                toast({
                    variant: 'destructive',
                    title: 'Image Upload Failed',
                    description: 'Could not upload the article image. Please try again.',
                });
                return;
            }
        }

        const articleData = {
            titleEnglish,
            titleGujarati,
            contentEnglish,
            contentGujarati,
            excerptEnglish,
            excerptGujarati,
            category,
            imageUrl: finalImageUrl,
            authorId: user.uid,
            publicationDate: serverTimestamp(),
            tags: category ? [category] : [],
            slug: titleEnglish.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        };
        addDocumentNonBlocking(articlesCollection, articleData);

        toast({
            title: "Article Published!",
            description: "Your new article has been submitted."
        });

        resetForm();
        forceRefetch();
    }

  return (
    <Tabs defaultValue="all_articles">
        <div className="flex items-center">
            <TabsList>
                <TabsTrigger value="all_articles">All Articles</TabsTrigger>
                <TabsTrigger value="new_article">New Article</TabsTrigger>
            </TabsList>
            <div className="ml-auto">
                <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Schedule Content
                </Button>
            </div>
        </div>
        <TabsContent value="all_articles">
            <Card>
                <CardHeader>
                <CardTitle>Manage Articles</CardTitle>
                <CardDescription>View, edit, or delete published articles.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Published At</TableHead>
                        <TableHead>
                        <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {articles?.map((article: any) => (
                        <TableRow key={article.id}>
                        <TableCell className="font-medium max-w-xs truncate">{article.titleEnglish}</TableCell>
                        <TableCell>{article.authorId}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{article.category}</Badge>
                        </TableCell>
                        <TableCell>{article.publicationDate?.toDate().toLocaleDateString()}</TableCell>
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
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="new_article">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Article</CardTitle>
                    <CardDescription>Fill in the details for the new article in both languages.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title-en">Title (English)</Label>
                            <Input id="title-en" placeholder="Enter English title" value={titleEnglish} onChange={(e) => setTitleEnglish(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title-gu">Title (Gujarati)</Label>
                            <Input id="title-gu" placeholder="Enter Gujarati title" value={titleGujarati} onChange={(e) => setTitleGujarati(e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="excerpt-en">Excerpt (English)</Label>
                            <Textarea id="excerpt-en" placeholder="Short summary in English" value={excerptEnglish} onChange={(e) => setExcerptEnglish(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="excerpt-gu">Excerpt (Gujarati)</Label>
                            <Textarea id="excerpt-gu" placeholder="Short summary in Gujarati" value={excerptGujarati} onChange={(e) => setExcerptGujarati(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="content-en">Content (English)</Label>
                            <Textarea id="content-en" placeholder="Full article content in English" rows={10} value={contentEnglish} onChange={(e) => setContentEnglish(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content-gu">Content (Gujarati)</Label>
                            <Textarea id="content-gu" placeholder="Full article content in Gujarati" rows={10} value={contentGujarati} onChange={(e) => setContentGujarati(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" placeholder="e.g. Politics" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Article Image</Label>
                            <div className="flex items-center gap-4">
                                <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
                                    {imagePreview ? (
                                    <Image src={imagePreview} alt="Article preview" width={200} height={96} className="object-contain h-24" />
                                    ) : (
                                    <span className="text-xs text-muted-foreground">Image Preview</span>
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
                    </div>
                    <Button onClick={handlePublish}>Publish Article</Button>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );
}

    