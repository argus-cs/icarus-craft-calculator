export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function parseQuantity(text: string): number {
  const num = parseInt(text.trim(), 10)
  return isNaN(num) || num <= 0 ? 1 : num
}

export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Extract tier from wikitext template field like `[[:Category:Tier 2|Tier 2]]`
 */
export function parseTier(wikitext: string): string | null {
  const match = wikitext.match(/Tier\s+(\d+)/i)
  if (!match) return null
  return `tier-${match[1]}`
}

/**
 * Extract crafting station names from wikitext bench field.
 * Handles: `{{ItemIconLink|Anvil Bench}}` or `{{Icon Link|Character Crafting}}`
 * May contain multiple stations separated by `<br>`.
 */
export function parseBench(benchField: string): string[] {
  const stations: string[] = []
  const pattern = /\{\{(?:ItemIconLink|Icon Link)\|([^|}]+)/g
  let match
  while ((match = pattern.exec(benchField)) !== null) {
    const name = match[1].trim()
    if (name) stations.push(name)
  }
  return stations
}

/**
 * Extract materials from wikitext crafting section.
 * Handles two formats:
 * - Table rows: `|10||{{ItemIconLink|Fiber}}` or `|10\n|{{ItemIconLink|Fiber}}`
 * - List items: `*5 {{ItemIconLink|Wood}}`
 */
export function parseMaterials(wikitext: string): { name: string; quantity: number }[] {
  const materials: { name: string; quantity: number }[] = []
  const seen = new Set<string>()

  // Pattern 1: Table rows — `|QTY||{{ItemIconLink|NAME}}` or `|QTY\n|{{ItemIconLink|NAME}}`
  const tablePattern = /\|(\d+)\s*\|+\s*\{\{ItemIconLink\|([^|}]+)/g
  let match
  while ((match = tablePattern.exec(wikitext)) !== null) {
    const name = match[2].trim()
    const qty = parseQuantity(match[1])
    if (name && !seen.has(name)) {
      materials.push({ name, quantity: qty })
      seen.add(name)
    }
  }

  // Pattern 2: Table rows split across lines — `|QTY\n|{{ItemIconLink|NAME}}`
  const splitTablePattern = /\|(\d+)\s*\n\s*\|\s*\{\{ItemIconLink\|([^|}]+)/g
  while ((match = splitTablePattern.exec(wikitext)) !== null) {
    const name = match[2].trim()
    const qty = parseQuantity(match[1])
    if (name && !seen.has(name)) {
      materials.push({ name, quantity: qty })
      seen.add(name)
    }
  }

  // Pattern 3: List items — `*QTY {{ItemIconLink|NAME}}`
  const listPattern = /^\*\s*(\d+)\s*\{\{ItemIconLink\|([^|}]+)/gm
  while ((match = listPattern.exec(wikitext)) !== null) {
    const name = match[2].trim()
    const qty = parseQuantity(match[1])
    if (name && !seen.has(name)) {
      materials.push({ name, quantity: qty })
      seen.add(name)
    }
  }

  return materials
}

/**
 * Extract a template field value from wikitext.
 * e.g. extractTemplateField(wikitext, 'bench') extracts the value after `| bench=`
 * Handles nested templates {{...}} and wiki links [[...]] within the value.
 */
export function extractTemplateField(wikitext: string, field: string): string {
  // Find `| field = ` and capture everything until the next `\n|` or `\n}}` at start of line
  const pattern = new RegExp(`\\|\\s*${field}\\s*=\\s*(.+?)(?=\\n\\s*\\||\\n\\}\\}|$)`, 'is')
  const match = wikitext.match(pattern)
  return match ? match[1].trim() : ''
}

/**
 * Extract icon image URL from wikitext template `image1=` field.
 * The field typically contains `ITEM_{{PAGENAME}}.png` which resolves to the wiki image.
 */
export function parseIconUrl(imageField: string, pageName: string): string {
  if (!imageField) return ''
  // Replace {{PAGENAME}} with actual page name
  const filename = imageField.replace(/\{\{PAGENAME\}\}/g, pageName).trim()
  if (!filename) return ''
  // Construct wiki image URL
  const encoded = encodeURIComponent(filename.replace(/ /g, '_'))
  return `https://static.wikia.nocookie.net/icarus/images/${encoded}`
}
