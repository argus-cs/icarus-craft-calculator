import { slugify, parseTier, parseBench, parseMaterials, extractTemplateField } from '../utils/parser'
import { getCategoryMembers, getPageWikitext, getImageUrl, delay, DELAY_MS } from './wiki-api'
import type { Item, Station, Category } from '../../app/types'
import type { ScraperResult } from './types'

/**
 * Generic scraper that fetches all items in a wiki category via MediaWiki API
 * and extracts crafting data from the wikitext.
 */
export async function scrapeCategory(
  wikiCategory: string,
  itemCategory: Category,
): Promise<ScraperResult> {
  const items: Item[] = []
  const stations: Station[] = []
  const warnings: string[] = []

  // 1. Get all page titles in the category
  const titles = await getCategoryMembers(wikiCategory)
  console.log(`    Found ${titles.length} pages in Category:${wikiCategory}`)

  // 2. Fetch and parse each page
  for (const title of titles) {
    try {
      await delay(DELAY_MS)

      const wikitext = await getPageWikitext(title)
      if (!wikitext) {
        warnings.push(`No wikitext for: ${title}`)
        continue
      }

      const id = slugify(title)
      const name = title

      // Extract tier from template
      const techField = extractTemplateField(wikitext, 'tech')
        || extractTemplateField(wikitext, 'tech_tier')
        || extractTemplateField(wikitext, 'techlvl')
      const tier = parseTier(techField)

      // Extract crafting station
      const benchField = extractTemplateField(wikitext, 'bench')
      const stationNames = parseBench(benchField)
      const craftedAt = stationNames.map(s => slugify(s))

      // Register stations
      for (const stName of stationNames) {
        const stId = slugify(stName)
        if (!stations.find(s => s.id === stId)) {
          stations.push({
            id: stId,
            name: stName,
            category: 'deployables',
            tier: tier || 'tier-1',
          })
        }
      }

      // Extract materials from Crafting/Refining section
      const craftingSection = extractCraftingSection(wikitext)
      const rawMaterials = parseMaterials(craftingSection)
      const materials = rawMaterials
        .filter(m => {
          const matId = slugify(m.name)
          return matId !== id && matId !== 'pagename' // exclude self-references and unresolved templates
        })
        .map(m => ({
          itemId: slugify(m.name),
          quantity: m.quantity,
        }))

      // Extract icon
      const imageField = extractTemplateField(wikitext, 'image1')
      const iconFilename = imageField
        ? imageField.replace(/\{\{PAGENAME\}\}/g, title.replace(/ /g, '_')).trim()
        : ''
      let icon = ''
      if (iconFilename) {
        icon = await getImageUrl(iconFilename)
      }

      items.push({
        id,
        name,
        category: itemCategory,
        tier,
        icon,
        craftedAt,
        materials,
      })
    } catch (err) {
      warnings.push(`Failed to process ${title}: ${(err as Error).message}`)
    }
  }

  return { items, stations, warnings }
}

/**
 * Extract the Crafting or Refining section from wikitext.
 * Looks for ==Crafting== or ==Refining== header and takes content until next ==header==.
 */
function extractCraftingSection(wikitext: string): string {
  // Find the Crafting/Refining/Recipe header
  const headerMatch = wikitext.match(/==\s*(?:Crafting|Refining|Recipe)\s*==/)
  if (!headerMatch || headerMatch.index === undefined) return ''

  // Get everything after the header
  const afterHeader = wikitext.slice(headerMatch.index + headerMatch[0].length)

  // Find the next == header (if any) and take everything before it
  const nextHeaderMatch = afterHeader.match(/\n==/)
  if (nextHeaderMatch && nextHeaderMatch.index !== undefined) {
    return afterHeader.slice(0, nextHeaderMatch.index)
  }
  return afterHeader
}
