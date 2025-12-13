'use client';

export interface RssArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl: string | null;
}

// Function to extract image from description CDATA
function extractImage(description: string): string | null {
  const imgMatch = description.match(/<img src="([^"]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

// Function to strip HTML from description
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

export async function fetchAndParseRss(feedUrl: string): Promise<RssArticle[]> {
  // Using a CORS proxy to fetch the RSS feed on the client-side
  const proxyUrl = 'https://api.allorigins.win/raw?url=';
  const response = await fetch(`${proxyUrl}${encodeURIComponent(feedUrl)}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
  }

  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
  
  const errorNode = xmlDoc.querySelector('parsererror');
  if (errorNode) {
    console.error('XML Parsing Error:', errorNode.textContent);
    // Try to find the root cause, sometimes it's in the body
    const bodyContent = xmlDoc.querySelector('body')?.textContent;
    if(bodyContent && bodyContent.includes("CORS")){
        throw new Error("CORS error detected via proxy. The RSS feed may be blocking requests.");
    }
    throw new Error('Failed to parse RSS XML.');
  }

  const items = Array.from(xmlDoc.querySelectorAll('item'));

  return items.map((item) => {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const descriptionCdata = item.querySelector('description')?.textContent || '';

    const imageUrl = extractImage(descriptionCdata);
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
