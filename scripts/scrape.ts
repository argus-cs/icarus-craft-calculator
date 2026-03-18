import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
import { scrapeTools } from './scrapers/tools'
import { scrapeConstructions } from './scrapers/constructions'
import { scrapeDeployables } from './scrapers/deployables'
import { scrapeResources } from './scrapers/resources'
import { writeItemsJson } from './utils/writer'
import type { Item, Station } from '../app/types'

async function main() {
  console.log('Starting Icarus Wiki scrape...\n')

  const allItems: Item[] = []
  const allStations: Station[] = []
  const allWarnings: string[] = []

  const scrapers = [
    { name: 'Tools', fn: scrapeTools },
    { name: 'Constructions', fn: scrapeConstructions },
    { name: 'Deployables', fn: scrapeDeployables },
    { name: 'Resources', fn: scrapeResources },
  ]

  for (const { name, fn } of scrapers) {
    console.log(`Scraping ${name}...`)
    const result = await fn()
    allItems.push(...result.items)
    allStations.push(...result.stations)
    allWarnings.push(...result.warnings)
    console.log(`  Done: ${result.items.length} items, ${result.warnings.length} warnings`)
  }

  const uniqueStations = allStations.reduce<Station[]>((acc, station) => {
    if (!acc.find(s => s.id === station.id)) acc.push(station)
    return acc
  }, [])

  if (allWarnings.length > 0) {
    console.log(`\n${allWarnings.length} warnings:`)
    allWarnings.forEach(w => console.log(`  - ${w}`))
  }

  if (allItems.length === 0) {
    console.error('\nFATAL: No items scraped. Aborting.')
    process.exit(1)
  }

  const outputPath = resolve(__dirname, '../public/data/items.json')
  writeItemsJson({ items: allItems, stations: uniqueStations, outputPath })

  console.log('\nScrape complete!')
}

main().catch((err) => {
  console.error('Scrape failed:', err)
  process.exit(1)
})
