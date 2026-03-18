import { scrapeCategory } from './category-scraper'
import type { ScraperResult } from './types'

export async function scrapeTools(): Promise<ScraperResult> {
  return scrapeCategory('Tools', 'tools')
}
