
'use client';
import { useState, useEffect, useCallback } from 'react';

export interface RssArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl: string | null;
  category?: string;
}

export interface YouTubeVideo {
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

const CACHE_KEY = 'content_cache';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
const WORKER_URL = 'https://still-king-03f4.agentk1710.workers.dev';

export const RSS_FEEDS: Record<string, string> = {
  topStories: 'https://www.gujaratsamachar.com/rss/top-stories',
  international: 'https://www.gujaratsamachar.com/rss/category/international',
  business: 'https://www.gujaratsamachar.com/rss/category/business',
  sports: 'https://www.gujaratsamachar.com/rss/category/sports',
  entertainment: 'https://www.gujaratsamachar.com/rss/category/entertainment',
  health: 'https://www.gujaratsamachar.com/rss/category/health',
  tech: 'https://www.gujaratsamachar.com/rss/category/science-technology',
  national: 'https://www.gujaratsamachar.com/rss/category/national'
};

function extractImage(item: Element): string | null {
    const mediaContent = item.querySelector('media\\:content, content');
    if (mediaContent && mediaContent.getAttribute('url')) {
        return mediaContent.getAttribute('url');
    }
    const enclosure = item.querySelector('enclosure');
    if (enclosure && enclosure.getAttribute('url')) {
        return enclosure.getAttribute('url');
    }
    const description = item.querySelector('description')?.textContent || '';
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = description.match(imgRegex);
    return match ? match[1] : null;
};

function stripHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

async function fetchAndParseRss(feedUrl: string): Promise<RssArticle[]> {
  const proxyUrl = `${WORKER_URL}/?type=rss&url=${encodeURIComponent(feedUrl)}`;
  const response = await fetch(proxyUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed from worker: ${response.statusText}`);
  }

  if (typeof window === 'undefined') return [];

  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const errorNode = xmlDoc.querySelector('parsererror');

  if (errorNode) {
    console.error('XML Parsing Error for feed:', feedUrl, errorNode.textContent);
    throw new Error(`Failed to parse RSS feed: ${feedUrl}`);
  }

  const items = Array.from(xmlDoc.querySelectorAll('item'));

  return items.map((item) => {
    const title = stripHtml(item.querySelector('title')?.textContent || '');
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const descriptionCdata = item.querySelector('description')?.textContent || '';
    const imageUrl = extractImage(item);
    const description = stripHtml(descriptionCdata).substring(0, 150) + '...';

    return { title, link, description, pubDate, imageUrl, category: item.querySelector('category')?.textContent || undefined };
  });
}

async function fetchYoutubeVideos(): Promise<YouTubeVideo[]> {
    const proxyUrl = `${WORKER_URL}/?type=youtube`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch YouTube videos' }));
        throw new Error(errorData.error || 'Failed to fetch YouTube videos');
    }
    const data = await response.json();
    return data.items || [];
}

export const useNewsAggregator = () => {
  const [news, setNews] = useState<Record<string, RssArticle[]>>({});
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllContent = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    if (!forceRefresh) {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, newsData, videoData } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setNews(newsData || {});
          setVideos(videoData || []);
          setLoading(false);
          return;
        }
      }
    }

    try {
      // Fetch RSS and YouTube data in parallel
      const [rssResults, youtubeResults] = await Promise.all([
        Promise.all(
          Object.entries(RSS_FEEDS).map(async ([key, url]) => {
            const items = await fetchAndParseRss(url);
            return [key, items] as [string, RssArticle[]];
          })
        ),
        fetchYoutubeVideos()
      ]);
      
      const newsData = Object.fromEntries(rssResults);

      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        newsData: newsData,
        videoData: youtubeResults,
      }));

      setNews(newsData);
      setVideos(youtubeResults);

    } catch (err: any) {
      setError(err.message || 'Failed to load content.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllContent();
  }, [loadAllContent]);

  return { news, videos, loading, error, refresh: () => loadAllContent(true) };
};

export function formatDate(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000; // seconds

        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch (e) {
        return '';
    }
}
