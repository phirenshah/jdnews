
'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
  
  export default function ArticlesAdminPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Articles</CardTitle>
          <CardDescription>Create, edit, and manage all articles for your news platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center p-4">
            <Newspaper className="w-16 h-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">Article Management on Hold</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This feature requires a backend service that may incur extra costs.
              <br />
              Functionality is currently under construction and will be enabled in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
