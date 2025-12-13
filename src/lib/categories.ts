export const sections = [
  { name: 'Top Stories', href: '/' },
  { name: 'International', href: '/category/international' },
  { name: 'National', href: '/category/national' },
  { name: 'Business', href: '/category/business' },
  { name: 'Sports', href: '/category/sports' },
  { name: 'Entertainment', href: '/category/entertainment' },
  { name: 'Health', href: '/category/health' },
  { name: 'Science-Technology', href: '/category/science-technology' },
];

const feedMap: Record<string, string> = {
    'Top Stories': 'top-stories',
    'International': 'international',
    'National': 'national',
    'Business': 'business',
    'Sports': 'sports',
    'Entertainment': 'entertainment',
    'Health': 'health',
    'Science-Technology': 'science-technology'
};

export function getFeedUrl(category: string, lang: 'en' | 'gu'): string | null {
    const categorySlug = feedMap[category];
    if (!categorySlug) return null;

    if (lang === 'gu') {
        const baseUrl = 'https://www.gujaratsamachar.com/rss';
        if (category === 'Top Stories') {
            return `${baseUrl}/top-stories`;
        }
        return `${baseUrl}/category/${categorySlug}`;
    }
    
    // English feeds can be added here in the future
    return null;
}
