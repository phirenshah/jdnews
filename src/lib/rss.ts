'use client';

export interface RssArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl: string | null;
}

// Function to extract image using multiple possible tags
function extractImage(item: Element): string | null {
  // Prefer media:content for high-quality images
  const mediaContent = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content')[0];
  if (mediaContent && mediaContent.getAttribute('url') && mediaContent.getAttribute('medium') === 'image') {
    return mediaContent.getAttribute('url');
  }

  // Fallback to enclosure
  const enclosure = item.querySelector('enclosure');
  if (enclosure && enclosure.getAttribute('type')?.startsWith('image/')) {
    return enclosure.getAttribute('url');
  }

  // Fallback to parsing description HTML
  const description = item.querySelector('description')?.textContent || '';
  const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

// Function to strip HTML from description
function stripHtml(html: string): string {
  if (typeof window === 'undefined') {
    return html; // Cannot parse on the server
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

export async function fetchAndParseRss(feedUrl: string): Promise<RssArticle[]> {
  // Using a CORS proxy to fetch the RSS feed on the client-side
  const proxyUrl = 'https://api.allorigins.win/raw?url=';
  const response = await fetch(`${proxyUrl}${encodeURIComponent(feedUrl)}`, { cache: 'no-store'});
  
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed via proxy. Status: ${response.status}`);
  }

  const xmlText = await response.text();
  
  if (typeof window === 'undefined') {
    return []; // Cannot parse on the server
  }
  
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
  
  const errorNode = xmlDoc.querySelector('parsererror');
  if (errorNode) {
    console.error('XML Parsing Error:', errorNode.textContent);
    const bodyContent = xmlDoc.querySelector('body')?.textContent;
    if(bodyContent && bodyContent.toLowerCase().includes("cors")){
        throw new Error("CORS error detected via proxy. The RSS feed source may be blocking requests.");
    }
    throw new Error('Failed to parse the RSS XML feed.');
  }

  const items = Array.from(xmlDoc.querySelectorAll('item'));
  if (items.length === 0) {
      return []; // Return empty array if no items found
  }

  return items.map((item) => {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const descriptionCdata = item.querySelector('description')?.textContent || '';

    const imageUrl = extractImage(item);
    const description = stripHtml(descriptionCdata).trim();

    return {
      title,
      link,
      description,
      pubDate,
      imageUrl,
    };
  });
}
