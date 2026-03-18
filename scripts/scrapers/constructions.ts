import { scrapeCategory } from './category-scraper'
import type { ScraperResult } from './types'

export async function scrapeConstructions(): Promise<ScraperResult> {
  return scrapeCategory('Building_Pieces', 'constructions')
}
