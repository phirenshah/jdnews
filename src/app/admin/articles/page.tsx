
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
import { MoreHorizontal, Upload, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { placeholderArticles } from "@/lib/placeholder-data";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Article } from "@/lib/definitions";
import { sections } from "@/lib/categories";

export default function ArticlesAdminPage() {
    const { toast } = useToast();
    const [articles, setArticles] = useState<Omit<Article, 'authorId' | 'contentEnglish' | 'contentGujarati'>[]>(placeholderArticles);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Form state
    const [titleEnglish, setTitleEnglish] = useState('');
    const [titleGujarati, setTitleGujarati] = useState('');
    const [excerptEnglish, setExcerptEnglish] = useState('');
    const [excerptGujarati, setExcerptGujarati] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const resetForm = () => {
        setTitleEnglish('');
        setTitleGujarati('');
        setExcerptEnglish('');
        setExcerptGujarati('');
        setAuthor('');
        setCategory('');
        setImageUrl('');
    }

    const handleCreateArticle = () => {
        if (!titleEnglish || !author || !category) {
            toast({ variant: 'destructive', title: 'Missing required fields', description: 'English Title, Author, and Category are required.' });
            return;
        }

        const newArticle = {
            id: `new-${Date.now()}`,
            slug: titleEnglish.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
            titleEnglish,
            titleGujarati,
            excerptEnglish,
            excerptGujarati,
            author,
            category,
            publicationDate: new Date().toISOString(),
            imageUrl,
        };

        setArticles(prev => [newArticle, ...prev]);
        toast({ title: 'Article "created" successfully.' , description: "This is a mock action and will only persist for this session." });
        resetForm();
        setIsDialogOpen(false);
    };


    const handleDelete = (articleId: string) => {
        setArticles(prev => prev.filter(a => a.id !== articleId));
        toast({ title: 'Article "deleted".' , description: "This is a mock action. Data is static."});
    };

  return (
    <>
      <div className="flex items-center mb-4">
        <div className="ml-auto flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Article
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Create New Article</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title-en">Title (English)</Label>
                                <Input id="title-en" value={titleEnglish} onChange={(e) => setTitleEnglish(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="title-gu">Title (Gujarati)</Label>
                                <Input id="title-gu" value={titleGujarati} onChange={(e) => setTitleGujarati(e.target.value)} />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="excerpt-en">Excerpt (English)</Label>
                                <Textarea id="excerpt-en" value={excerptEnglish} onChange={(e) => setExcerptEnglish(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="excerpt-gu">Excerpt (Gujarati)</Label>
                                <Textarea id="excerpt-gu" value={excerptGujarati} onChange={(e) => setExcerptGujarati(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sections.map(section => (
                                            <SelectItem key={section.name} value={section.name}>{section.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <Input id="image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateArticle}>Save Article</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>
      <Card>
          <CardHeader>
          <CardTitle>Manage Articles</CardTitle>
          <CardDescription>View, edit, or delete published articles from the static placeholder data.</CardDescription>
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
              {articles?.map((article) => (
                  <TableRow key={article.id}>
                  <TableCell className="font-medium max-w-xs truncate">{article.titleEnglish}</TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                  </TableCell>
                  <TableCell>{new Date(article.publicationDate).toLocaleDateString()}</TableCell>
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
                          <DropdownMenuItem onSelect={() => handleDelete(article.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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
    </>
  );
}
