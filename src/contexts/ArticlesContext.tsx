'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RssArticle } from '@/lib/rss';

interface ArticlesContextType {
  articles: RssArticle[];
  setArticles: (articles: RssArticle[]) => void;
  addArticle: (article: RssArticle) => void;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<RssArticle[]>([]);

  const addArticle = (article: RssArticle) => {
    setArticles(prevArticles => [article, ...prevArticles]);
  };

  return (
    <ArticlesContext.Provider value={{ articles, setArticles, addArticle }}>
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticlesProvider');
  }
  return context;
};
