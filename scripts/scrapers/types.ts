import type { Item, Station } from '../../app/types'

export interface ScraperResult {
  items: Item[]
  stations: Station[]
  warnings: string[]
}

export interface CategoryScraper {
  name: string
  scrape(): Promise<ScraperResult>
}
