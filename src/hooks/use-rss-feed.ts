
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

const CACHE_KEY = 'rss_feed_cache';
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

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
  const proxyUrl = `/api/rss?type=rss&url=${encodeURIComponent(feedUrl)}`;
  const response = await fetch(proxyUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed from proxy: ${response.statusText}`);
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

export const useNewsAggregator = () => {
  const [news, setNews] = useState<Record<string, RssArticle[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    if (!forceRefresh) {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setNews(data);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const promises = Object.entries(RSS_FEEDS).map(async ([key, url]) => {
        const items = await fetchAndParseRss(url);
        return [key, items];
      });

      const results = await Promise.all(promises);
      const newsData = Object.fromEntries(results);

      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: newsData
      }));

      setNews(newsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load news feeds.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllNews();
  }, [loadAllNews]);

  return { news, loading, error, refresh: () => loadAllNews(true) };
};