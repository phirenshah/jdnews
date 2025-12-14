
'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Film, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

export default function VideosPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch('/api/rss?type=youtube');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch videos');
        }
        const data = await response.json();
        setVideos(data.items);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const renderSkeletons = () => (
    Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ))
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="border-l-4 border-primary pl-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground uppercase tracking-tight flex items-center gap-3">
          <Film size={32} className="text-primary" />
          Latest Videos
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {renderSkeletons()}
        </div>
      ) : error ? (
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Videos</AlertTitle>
          <AlertDescription>
            {error}. This may be due to a missing API key or other configuration issues.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {videos.map((video) => (
            <Card key={video.id.videoId} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <a
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <Image
                    src={video.snippet.thumbnails.high.url}
                    alt={video.snippet.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Film className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg font-headline leading-snug line-clamp-2 group-hover:text-primary">
                    {video.snippet.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
                    {video.snippet.description}
                  </p>
                </div>
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
