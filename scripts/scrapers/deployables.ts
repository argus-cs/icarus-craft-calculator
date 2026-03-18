import * as cheerio from 'cheerio'
import { ofetch } from 'ofetch'
import { slugify, cleanText, parseQuantity } from '../utils/parser'
import type { Item, Station } from '../../app/types'
import type { ScraperResult } from './types'

const WIKI_BASE = 'https://icarus.fandom.com'
const CATEGORY_URL = `${WIKI_BASE}/wiki/Category:Deployables`

export async function scrapeDeployables(): Promise<ScraperResult> {
  const items: Item[] = []
  const stations: Station[] = []
  const warnings: string[] = []

  try {
    const html = await ofetch(CATEGORY_URL, { responseType: 'text' })
    const $ = cheerio.load(html)

    const itemLinks: string[] = []
    $('a.category-page__member-link').each((_, el) => {
      const href = $(el).attr('href')
      if (href) itemLinks.push(`${WIKI_BASE}${href}`)
    })

    for (const url of itemLinks) {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))

        const itemHtml = await ofetch(url, { responseType: 'text' })
        const item$ = cheerio.load(itemHtml)

        const name = cleanText(item$('h1.page-header__title').text())
        if (!name) {
          warnings.push(`Could not extract name from ${url}`)
          continue
        }

        const id = slugify(name)
        const materials: { itemId: string; quantity: number }[] = []
        const craftedAt: string[] = []

        let tier: string | null = null
        item$('.pi-data').each((_, el) => {
          const label = item$(el).find('.pi-data-label').text().toLowerCase()
          if (label.includes('tier')) {
            tier = cleanText(item$(el).find('.pi-data-value').text()).toLowerCase().replace(/\s+/g, '-')
          }
        })

        item$('.pi-data').each((_, el) => {
          const label = item$(el).find('.pi-data-label').text().toLowerCase()
          if (label.includes('material') || label.includes('ingredient') || label.includes('recipe')) {
            item$(el).find('.pi-data-value li, .pi-data-value a').each((_, matEl) => {
              const matText = cleanText(item$(matEl).text())
              const match = matText.match(/^(\d+)\s*[x\u00d7]?\s*(.+)$/) || matText.match(/^(.+?)\s*[x\u00d7]\s*(\d+)$/)
              if (match) {
                const qty = parseInt(match[1], 10) || parseInt(match[2], 10)
                const matName = match[2] || match[1]
                materials.push({ itemId: slugify(matName.trim()), quantity: qty || 1 })
              }
            })
          }
          if (label.includes('station') || label.includes('crafted')) {
            item$(el).find('.pi-data-value a, .pi-data-value').each((_, stEl) => {
              const stName = cleanText(item$(stEl).text())
              if (stName) {
                const stId = slugify(stName)
                craftedAt.push(stId)
                if (!stations.find(s => s.id === stId)) {
                  stations.push({ id: stId, name: stName, category: 'deployables', tier: tier || 'tier-1' })
                }
              }
            })
          }
        })

        items.push({
          id, name, category: 'deployables', tier,
          icon: `/icons/${id}.png`,
          craftedAt, materials,
        })
      } catch (err) {
        warnings.push(`Failed to scrape ${url}: ${(err as Error).message}`)
      }
    }
  } catch (err) {
    warnings.push(`Failed to fetch category page: ${(err as Error).message}`)
  }

  return { items, stations, warnings }
}
