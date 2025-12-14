'use server';

import { NextResponse } from 'next/server';

const GUJARAT_SAMACHAR_RSS_HOST = 'https://www.gujaratsamachar.com/rss';
const YOUTUBE_CHANNEL_ID = 'UCMzD2uA6t3T1sF2-N3tXgUw';

// This function handles fetching and caching data from external sources
async function fetcher(url: string, options: RequestInit, ttl: number) {
  const response = await fetch(url, { ...options, next: { revalidate: ttl } });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Failed to fetch ${url}`, { status: response.status, body: errorBody });
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response;
}

// Handler for RSS feeds
async function handleRssRequest(request: Request) {
  const { searchParams } = new URL(request.url);
  const rssUrl = searchParams.get('url');

  if (!rssUrl) {
    return NextResponse.json({ error: 'Missing RSS URL parameter' }, { status: 400 });
  }

  // Validate the RSS source to only allow Gujarat Samachar
  if (!rssUrl.startsWith(GUJARAT_SAMACHAR_RSS_HOST)) {
    return NextResponse.json({ error: 'Invalid RSS source' }, { status: 403 });
  }

  try {
    const response = await fetcher(rssUrl, {
      headers: {
        'User-Agent': 'JD-News-Aggregator/1.0',
        'Accept': 'application/rss+xml, application/xml',
      },
    }, 300); // Cache for 5 minutes

    const xml = await response.text();
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feed', detail: errorMessage },
      { status: 500 }
    );
  }
}

// Handler for YouTube videos
async function handleYoutubeRequest() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'YouTube API key is not configured' }, { status: 500 });
  }

  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=12`;

  try {
    const response = await fetcher(url, {}, 300); // Cache for 5 minutes
    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube videos', detail: errorMessage },
      { status: 500 }
    );
  }
}

// Main GET handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  switch (type) {
    case 'rss':
      return handleRssRequest(request);
    case 'youtube':
      return handleYoutubeRequest();
    default:
      return NextResponse.json({ error: 'Invalid type parameter. Use "rss" or "youtube".' }, { status: 400 });
  }
}
