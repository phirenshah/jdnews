
'use client';
import { Film } from 'lucide-react';

export default function VideosPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg text-center p-4">
        <Film className="w-16 h-16 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold">Video Content Coming Soon</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This section is under construction. Please check back later for video news content.
        </p>
      </div>
    </div>
  );
}
