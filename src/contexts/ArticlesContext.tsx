
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { placeholderArticles as defaultArticles } from '@/lib/placeholder-data';
import type { Article } from '@/lib/definitions';

type StrippedArticle = Omit<Article, 'authorId' | 'contentEnglish' | 'contentGujarati'>;

interface ArticlesContextType {
  articles: StrippedArticle[];
  addArticle: (article: StrippedArticle) => void;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<StrippedArticle[]>(defaultArticles);

  const addArticle = (article: StrippedArticle) => {
    setArticles(prevArticles => [article, ...prevArticles]);
  };

  return (
    <ArticlesContext.Provider value={{ articles, addArticle }}>
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
