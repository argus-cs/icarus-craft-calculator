import { scrapeCategory } from './category-scraper'
import type { ScraperResult } from './types'

export async function scrapeDeployables(): Promise<ScraperResult> {
  return scrapeCategory('Deployables', 'deployables')
}
