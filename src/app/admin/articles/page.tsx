
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
import { placeholderArticles, placeholderReporters } from "@/lib/placeholder-data";

export default function ArticlesAdminPage() {
    const { toast } = useToast();
    const [articles, setArticles] = useState(placeholderArticles);

    const handleDelete = (articleId: string) => {
        setArticles(prev => prev.filter(a => a.id !== articleId));
        toast({ title: 'Article "deleted".' , description: "This is a mock action. Data is static."});
    };

  return (
    <>
      <div className="flex items-center mb-4">
        <div className="ml-auto flex items-center gap-2">
            <Button size="sm" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Upload Article
            </Button>
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
              {articles?.map((article: any) => (
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
