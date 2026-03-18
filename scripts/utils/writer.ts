import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { ItemsDataSchema } from './schema'
import type { Item, Station } from '../../app/types'

interface WriteOptions {
  items: Item[]
  stations: Station[]
  outputPath: string
  version?: string
}

export function writeItemsJson({ items, stations, outputPath, version = '1.0.0' }: WriteOptions): void {
  const data = {
    version,
    generatedAt: new Date().toISOString(),
    items,
    stations,
  }

  // Validate with Zod before writing
  const result = ItemsDataSchema.safeParse(data)
  if (!result.success) {
    console.error('Validation errors:', result.error.format())
    throw new Error(`Generated data failed validation: ${result.error.message}`)
  }

  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')

  // Summary log
  const categoryCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {})

  console.log('\n=== Scrape Summary ===')
  for (const [cat, count] of Object.entries(categoryCounts)) {
    console.log(`  ${cat}: ${count} items`)
  }
  console.log(`  stations: ${stations.length}`)
  console.log(`  total items: ${items.length}`)
  console.log(`  output: ${outputPath}`)
}
