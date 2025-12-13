
'use client';

export interface RssArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl: string | null;
  category?: string;
}

function extractImage(item: Element): string | null {
    // Prefer media:content
    const mediaContent = item.querySelector('media\\:content, content');
    if (mediaContent && mediaContent.getAttribute('url')) {
        return mediaContent.getAttribute('url');
    }

    // Fallback to enclosure
    const enclosure = item.querySelector('enclosure');
    if (enclosure && enclosure.getAttribute('url')) {
        return enclosure.getAttribute('url');
    }

    // Fallback to parsing img tag from description
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

export async function fetchAndParseRss(feedUrl: string): Promise<RssArticle[]> {
  const proxyUrl = `/api/rss?url=${encodeURIComponent(feedUrl)}`;
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

    return {
      title,
      link,
      description,
      pubDate,
      imageUrl,
      category: item.querySelector('category')?.textContent || undefined
    };
  });
}
