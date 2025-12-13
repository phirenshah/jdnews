
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Trash2, Edit, Camera, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCollection,
  useFirebase,
  useMemoFirebase,
  addDocumentNonBlocking,
  setDocumentNonBlocking,
  deleteDocumentNonBlocking
} from '@/firebase';
import { useState, useRef, useEffect } from 'react';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import axios from 'axios';


// This would come from a database in a real application
const placeholderAdRequests = [
  {
    id: 'ad-req-1',
    topic: 'New Smartphone Launch',
    phoneNumber: '+91 98765 43210',
    budget: 800000,
    details:
      'We are launching a new smartphone and want to target tech-savvy readers in major metro areas. Campaign to run for 2 weeks.',
    status: 'Pending',
    date: '2024-07-29',
  },
  {
    id: 'ad-req-2',
    topic: 'Local Restaurant Opening',
    phoneNumber: '+91 98765 43211',
    budget: 200000,
    details:
      'Grand opening of a new Italian restaurant in downtown. Looking for a full-page feature.',
    status: 'Contacted',
    date: '2024-07-28',
  },
];

type Ad = {
  id: string;
  name: string;
  type: 'image' | 'html';
  url?: string;
  htmlCode?: string;
  placement: 'horizontal' | 'vertical';
};

export default function AdvertiseAdminPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const adsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'advertisements') : null),
    [firestore]
  );
  const { data: ads, forceRefetch } = useCollection<Ad>(adsCollection);

  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [adName, setAdName] = useState('');
  const [adType, setAdType] = useState<'image' | 'html' | ''>('');
  const [adUrl, setAdUrl] = useState('');
  const [adHtmlCode, setAdHtmlCode] = useState('');
  const [adPlacement, setAdPlacement] = useState<'horizontal' | 'vertical' | ''>('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const resetForm = () => {
    setEditingAd(null);
    setAdName('');
    setAdType('');
    setAdUrl('');
    setAdHtmlCode('');
    setAdPlacement('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setAdName(ad.name);
    setAdType(ad.type);
    setAdUrl(ad.url || '');
    setAdHtmlCode(ad.htmlCode || '');
    setAdPlacement(ad.placement);
    setImagePreview(ad.url || null);
    setImageFile(null);
  };

  const handleDelete = (adId: string) => {
    if (!firestore) return;
    const adDocRef = doc(firestore, 'advertisements', adId);
    deleteDocumentNonBlocking(adDocRef);
    toast({ title: 'Advertisement deleted.' });
    forceRefetch();
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

  const handleSubmit = async () => {
    if (!firestore || !adName || !adType || !adPlacement) {
        toast({
            variant: 'destructive',
            title: 'Missing Fields',
            description: 'Please fill out all required fields to create or update an ad.',
        });
        return;
    }
    
    let finalAdUrl = editingAd?.url || '';

    if (adType === 'image') {
      if(imageFile) {
        try {
          const formData = new FormData();
          formData.append('key', "3f5f08b61f4298484f11df25a094c176"); // Replace with your ImgBB API key if you have one
          formData.append('image', imageFile);

          const response = await axios.post('https://api.imgbb.com/1/upload', formData);
          finalAdUrl = response.data.data.url;
        } catch (error) {
            console.error("Image upload failed:", error);
            toast({
                variant: 'destructive',
                title: 'Image Upload Failed',
                description: 'Could not upload the ad image. Please try again.',
            });
            return;
        }
      } else if (!finalAdUrl) {
        toast({ variant: 'destructive', title: 'Missing Image', description: 'Please provide an image for the ad.' });
        return;
      }
    }

    if (adType === 'html' && !adHtmlCode) {
        toast({ variant: 'destructive', title: 'Missing HTML Code', description: 'Please provide the ad HTML code.' });
        return;
    }

    const adData = {
        name: adName,
        type: adType,
        placement: adPlacement,
        url: adType === 'image' ? finalAdUrl : '',
        htmlCode: adType === 'html' ? adHtmlCode : '',
    };

    if (editingAd) {
        const adDocRef = doc(firestore, 'advertisements', editingAd.id);
        setDocumentNonBlocking(adDocRef, adData, { merge: true });
        toast({ title: 'Advertisement Updated' });
    } else {
        if (!adsCollection) return;
        addDocumentNonBlocking(adsCollection, adData);
        toast({ title: 'Advertisement Created' });
    }
    resetForm();
    forceRefetch();
  };

  return (
    <Tabs defaultValue="requests">
      <TabsList>
        <TabsTrigger value="requests">Ad Requests</TabsTrigger>
        <TabsTrigger value="manage_ads">Manage Ads</TabsTrigger>
      </TabsList>
      <TabsContent value="requests">
        <Card>
          <CardHeader>
            <CardTitle>Advertising Requests</CardTitle>
            <CardDescription>
              Review and manage incoming advertising inquiries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Budget (INR)</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placeholderAdRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.date}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {req.topic}
                    </TableCell>
                    <TableCell>
                      ₹{req.budget.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${req.phoneNumber}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === 'Pending'
                            ? 'secondary'
                            : req.status === 'Contacted'
                            ? 'default'
                            : 'outline'
                        }
                        className={
                          req.status === 'Pending'
                            ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/40'
                            : req.status === 'Contacted'
                            ? 'bg-blue-500/20 text-blue-700 border-blue-500/40'
                            : ''
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="manage_ads">
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>{editingAd ? 'Edit Ad' : 'Create New Ad'}</CardTitle>
                        <CardDescription>
                            {editingAd ? 'Update the details for this ad.' : 'Create a new ad to display on the website.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="ad-name">Ad Name</Label>
                            <Input id="ad-name" placeholder="e.g. Summer Sale Banner" value={adName} onChange={(e) => setAdName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ad-placement">Placement</Label>
                            <Select value={adPlacement} onValueChange={(value) => setAdPlacement(value as any)}>
                                <SelectTrigger id="ad-placement">
                                    <SelectValue placeholder="Select placement" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="horizontal">Horizontal Banner</SelectItem>
                                    <SelectItem value="vertical">Vertical Sidebar</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="ad-type">Type</Label>
                            <Select value={adType} onValueChange={(value) => setAdType(value as any)}>
                                <SelectTrigger id="ad-type">
                                    <SelectValue placeholder="Select ad type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="html">HTML Code</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {adType === 'image' && (
                            <div className="space-y-2">
                              <Label>Ad Banner Image</Label>
                                <div className="flex items-center gap-4">
                                  <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
                                    {imagePreview ? (
                                      <Image src={imagePreview} alt="Ad preview" width={200} height={96} className="object-contain h-24" />
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
                        )}
                        {adType === 'html' && (
                            <div className="space-y-2">
                                <Label htmlFor="ad-html">HTML Code</Label>
                                <Textarea id="ad-html" rows={6} placeholder="<iframe src=... ></iframe>" value={adHtmlCode} onChange={(e) => setAdHtmlCode(e.target.value)} />
                            </div>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleSubmit} className="w-full">{editingAd ? 'Update Ad' : 'Create Ad'}</Button>
                            {editingAd && <Button variant="outline" onClick={resetForm} className="w-full">Cancel</Button>}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Ads</CardTitle>
                        <CardDescription>List of all active advertisements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Placement</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ads?.map((ad) => (
                                    <TableRow key={ad.id}>
                                        <TableCell className="font-medium">{ad.name}</TableCell>
                                        <TableCell className="capitalize">{ad.placement}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{ad.type}</Badge>
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(ad)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(ad.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
