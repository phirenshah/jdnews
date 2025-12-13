
'use client';
import { useState, useEffect, useCallback }from 'react';
import { fetchAndParseRss, RssArticle } from '@/lib/rss';

const CACHE_KEY = 'gujarat_samachar_cache';
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

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

export const useNewsAggregator = () => {
  const [news, setNews] = useState<Record<string, RssArticle[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const loadAllNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    // Check Cache
    if (!forceRefresh) {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setNews(data);
          setLastUpdated(timestamp);
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
      setLastUpdated(Date.now());
    } catch (err: any) {
      setError(err.message || 'Failed to load news feeds. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllNews();
  }, [loadAllNews]);

  return { news, loading, error, refresh: () => loadAllNews(true), lastUpdated };
};
