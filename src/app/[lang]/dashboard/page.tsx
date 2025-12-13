
'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore, useMemoFirebase } from "@/firebase";
import { useState, useEffect } from "react";
import { collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useUserRole } from "@/hooks/use-user-role";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
    const { firestore } = useFirestore();
    const { user, role, isLoading } = useUserRole();
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as string;
    const { toast } = useToast();
    
    const articlesCollection = useMemoFirebase(() => collection(firestore, 'articles'), [firestore]);

    const [titleEnglish, setTitleEnglish] = useState('');
    const [titleGujarati, setTitleGujarati] = useState('');
    const [contentEnglish, setContentEnglish] = useState('');
    const [contentGujarati, setContentGujarati] = useState('');
    const [excerptEnglish, setExcerptEnglish] = useState('');
    const [excerptGujarati, setExcerptGujarati] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (!isLoading) {
            const canAccess = role && ['reporter', 'editor', 'director'].includes(role);
            if (!user) {
                router.push(`/${lang}/login?redirect=/${lang}/dashboard`);
            } else if (!canAccess) {
                 toast({
                    variant: "destructive",
                    title: "Access Denied",
                    description: "You do not have permission to access this page.",
                });
                router.push(`/${lang}/profile`);
            }
        }
    }, [user, role, isLoading, router, lang, toast]);
    
    const handlePublish = () => {
        if (!user || !articlesCollection) return;
        
        const articleData = {
            titleEnglish,
            titleGujarati,
            contentEnglish,
            contentGujarati,
            excerptEnglish,
            excerptGujarati,
            category,
            imageUrl,
            authorId: user.uid,
            publicationDate: serverTimestamp(),
            tags: category ? [category] : [],
        };
        addDocumentNonBlocking(articlesCollection, articleData);

        toast({
            title: "Article Published!",
            description: "Your article has been submitted successfully."
        });

        // Clear form
        setTitleEnglish('');
        setTitleGujarati('');
        setContentEnglish('');
        setContentGujarati('');
        setExcerptEnglish('');
        setExcerptGujarati('');
        setCategory('');
        setImageUrl('');
    }

    if (isLoading || !user || !role || !['reporter', 'editor', 'director'].includes(role)) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Write a New Article</CardTitle>
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
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    </div>
                </div>
                <Button onClick={handlePublish}>Publish Article</Button>
            </CardContent>
        </Card>
    </div>
  );
}
