import { scrapeCategory } from './category-scraper'
import type { ScraperResult } from './types'

export async function scrapeResources(): Promise<ScraperResult> {
  return scrapeCategory('Resources', 'resources')
}
