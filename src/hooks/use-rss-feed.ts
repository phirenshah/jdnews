'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchAndParseRss, RssArticle } from '@/lib/rss';

export function useRssFeed(feedUrl: string | null) {
  const [articles, setArticles] = useState<RssArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);

    const cacheKey = `rss_${url}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const isCacheFresh = (Date.now() - timestamp) < 10 * 60 * 1000; // 10 minutes
      if (isCacheFresh) {
        setArticles(data);
        setIsLoading(false);
        return;
      }
    }

    try {
      const fetchedArticles = await fetchAndParseRss(url);
      setArticles(fetchedArticles);
      sessionStorage.setItem(cacheKey, JSON.stringify({ data: fetchedArticles, timestamp: Date.now() }));
    } catch (e: any) {
      setError(e.message || 'Failed to fetch RSS feed.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (feedUrl) {
      fetchFeed(feedUrl);
    } else {
      setArticles([]);
      setIsLoading(false);
      setError(null);
    }
  }, [feedUrl, fetchFeed]);

  return { articles, isLoading, error };
}
