import { scrapeCategory } from './category-scraper'
import type { ScraperResult } from './types'

export async function scrapeResources(): Promise<ScraperResult> {
  // Scrape main category + subcategories that contain crafting materials
  const categories = ['Resources', 'Crafted_Resources', 'Animal_Resources']

  const allItems: ScraperResult['items'] = []
  const allStations: ScraperResult['stations'] = []
  const allWarnings: ScraperResult['warnings'] = []
  const seenIds = new Set<string>()

  for (const cat of categories) {
    const result = await scrapeCategory(cat, 'resources')

    for (const item of result.items) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id)
        allItems.push(item)
      }
    }

    for (const station of result.stations) {
      if (!allStations.find(s => s.id === station.id)) {
        allStations.push(station)
      }
    }

    allWarnings.push(...result.warnings)
  }

  return { items: allItems, stations: allStations, warnings: allWarnings }
}
