import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const rssUrl = searchParams.get('url')

  if (!rssUrl) {
    return NextResponse.json({ error: 'Missing RSS URL' }, { status: 400 })
  }

  try {
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/rss+xml, application/xml'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`)
    }

    const xml = await response.text()

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Failed to fetch RSS', detail: errorMessage },
      { status: 500 }
    )
  }
}
