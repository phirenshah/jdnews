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
import { placeholderArticles } from "@/lib/placeholder-data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
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

export default function ArticlesAdminPage() {
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
                    {placeholderArticles.map((article) => (
                        <TableRow key={article.id}>
                        <TableCell className="font-medium max-w-xs truncate">{article.title.en}</TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{article.category}</Badge>
                        </TableCell>
                        <TableCell>{article.publishedAt}</TableCell>
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
                            <Input id="title-en" placeholder="Enter English title" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title-gu">Title (Gujarati)</Label>
                            <Input id="title-gu" placeholder="Enter Gujarati title" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="excerpt-en">Excerpt (English)</Label>
                            <Textarea id="excerpt-en" placeholder="Short summary in English" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="excerpt-gu">Excerpt (Gujarati)</Label>
                            <Textarea id="excerpt-gu" placeholder="Short summary in Gujarati" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="content-en">Content (English)</Label>
                            <Textarea id="content-en" placeholder="Full article content in English" rows={10}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content-gu">Content (Gujarati)</Label>
                            <Textarea id="content-gu" placeholder="Full article content in Gujarati" rows={10} />
                        </div>
                    </div>
                    <Button>Publish Article</Button>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );
}
