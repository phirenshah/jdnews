
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
  const enclosure = item.querySelector('enclosure');
  if (enclosure) return enclosure.getAttribute('url');
  
  const mediaContent = item.getElementsByTagNameNS('*', 'content')[0];
  if (mediaContent && mediaContent.getAttribute('url')) return mediaContent.getAttribute('url');

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
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
  const response = await fetch(proxyUrl);
  const data = await response.json();
  
  if (!data.contents) throw new Error(`No content received from ${feedUrl}`);

  if (typeof window === 'undefined') return [];

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
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
