import { ofetch } from 'ofetch'

const API_BASE = 'https://icarus.fandom.com/api.php'
const USER_AGENT = 'IcarusCraftCalculator/1.0 (scraper; +https://github.com)'
const DELAY_MS = 200

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Fetch all page titles in a wiki category via the MediaWiki API.
 * Handles pagination automatically.
 */
export async function getCategoryMembers(category: string): Promise<string[]> {
  const titles: string[] = []
  let cmcontinue: string | undefined

  do {
    const params: Record<string, string> = {
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${category}`,
      cmlimit: '500',
      cmtype: 'page',
      format: 'json',
    }
    if (cmcontinue) params.cmcontinue = cmcontinue

    const data = await ofetch(API_BASE, {
      query: params,
      headers: { 'User-Agent': USER_AGENT },
    })

    for (const member of data.query?.categorymembers ?? []) {
      titles.push(member.title)
    }

    cmcontinue = data.continue?.cmcontinue
    if (cmcontinue) await delay(DELAY_MS)
  } while (cmcontinue)

  return titles
}

/**
 * Fetch the wikitext source of a page via the MediaWiki API.
 */
export async function getPageWikitext(title: string): Promise<string | null> {
  try {
    const data = await ofetch(API_BASE, {
      query: {
        action: 'parse',
        page: title,
        prop: 'wikitext',
        format: 'json',
      },
      headers: { 'User-Agent': USER_AGENT },
    })

    return data.parse?.wikitext?.['*'] ?? null
  } catch {
    return null
  }
}

/**
 * Fetch the actual image URL for a wiki file name.
 * Returns the direct URL to the image.
 */
export async function getImageUrl(filename: string): Promise<string> {
  try {
    const data = await ofetch(API_BASE, {
      query: {
        action: 'query',
        titles: `File:${filename}`,
        prop: 'imageinfo',
        iiprop: 'url',
        iiurlwidth: '50',
        format: 'json',
      },
      headers: { 'User-Agent': USER_AGENT },
    })

    const pages = data.query?.pages ?? {}
    for (const page of Object.values(pages) as any[]) {
      if (page.imageinfo?.[0]?.thumburl) {
        return page.imageinfo[0].thumburl
      }
      if (page.imageinfo?.[0]?.url) {
        return page.imageinfo[0].url
      }
    }
  } catch {
    // ignore
  }
  return ''
}

export { DELAY_MS, delay }
