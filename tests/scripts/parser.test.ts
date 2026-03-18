import { describe, it, expect } from 'vitest'
import { slugify, parseQuantity, cleanText, parseTier, parseBench, parseMaterials, extractTemplateField } from '../../scripts/utils/parser'

describe('slugify', () => {
  it('converts name to kebab-case id', () => {
    expect(slugify('Steel Pickaxe')).toBe('steel-pickaxe')
  })

  it('handles special characters', () => {
    expect(slugify("Gatherer's Backpack")).toBe('gatherers-backpack')
  })

  it('trims and handles multiple spaces', () => {
    expect(slugify('  Iron   Ingot  ')).toBe('iron-ingot')
  })
})

describe('parseQuantity', () => {
  it('parses integer string', () => {
    expect(parseQuantity('10')).toBe(10)
  })

  it('parses string with whitespace', () => {
    expect(parseQuantity(' 5 ')).toBe(5)
  })

  it('returns 1 for invalid input', () => {
    expect(parseQuantity('')).toBe(1)
    expect(parseQuantity('abc')).toBe(1)
  })
})

describe('cleanText', () => {
  it('removes extra whitespace and trims', () => {
    expect(cleanText('  Hello   World  ')).toBe('Hello World')
  })

  it('removes newlines', () => {
    expect(cleanText('Hello\nWorld')).toBe('Hello World')
  })
})

describe('parseTier', () => {
  it('extracts tier from category link', () => {
    expect(parseTier('[[:Category:Tier 2|Tier 2]]')).toBe('tier-2')
  })

  it('extracts tier from plain text', () => {
    expect(parseTier('Tier 1')).toBe('tier-1')
  })

  it('returns null for no tier', () => {
    expect(parseTier('')).toBeNull()
    expect(parseTier('something else')).toBeNull()
  })
})

describe('parseBench', () => {
  it('extracts station from ItemIconLink', () => {
    expect(parseBench('{{ItemIconLink|Anvil Bench}}')).toEqual(['Anvil Bench'])
  })

  it('extracts station from Icon Link', () => {
    expect(parseBench('{{Icon Link|Character Crafting}}')).toEqual(['Character Crafting'])
  })

  it('extracts multiple stations separated by br', () => {
    const input = '{{ItemIconLink|Stone Furnace}}<br>{{ItemIconLink|Concrete Furnace}}<br>{{ItemIconLink|Electric Furnace}}'
    expect(parseBench(input)).toEqual(['Stone Furnace', 'Concrete Furnace', 'Electric Furnace'])
  })

  it('returns empty array for no bench', () => {
    expect(parseBench('')).toEqual([])
  })
})

describe('parseMaterials', () => {
  it('parses table format with double pipe', () => {
    const wikitext = `|10||{{ItemIconLink|Fiber}}\n|-\n|4||{{ItemIconLink|Stick}}`
    const result = parseMaterials(wikitext)
    expect(result).toEqual([
      { name: 'Fiber', quantity: 10 },
      { name: 'Stick', quantity: 4 },
    ])
  })

  it('parses list format', () => {
    const wikitext = `*5 {{ItemIconLink|Wood}}\n*4 {{ItemIconLink|Leather}}\n*6 {{ItemIconLink|Iron Ingot}}`
    const result = parseMaterials(wikitext)
    expect(result).toEqual([
      { name: 'Wood', quantity: 5 },
      { name: 'Leather', quantity: 4 },
      { name: 'Iron Ingot', quantity: 6 },
    ])
  })

  it('returns empty for no materials', () => {
    expect(parseMaterials('Some text without materials')).toEqual([])
  })
})

describe('extractTemplateField', () => {
  it('extracts bench field', () => {
    const wikitext = `| bench={{ItemIconLink|Anvil Bench}}\n| repair=`
    expect(extractTemplateField(wikitext, 'bench')).toBe('{{ItemIconLink|Anvil Bench}}')
  })

  it('extracts tech field with category link', () => {
    const wikitext = `| tech=[[:Category:Tier 2|Tier 2]]\n| description=`
    expect(extractTemplateField(wikitext, 'tech')).toBe('[[:Category:Tier 2|Tier 2]]')
  })

  it('returns empty string for missing field', () => {
    expect(extractTemplateField('| name=Test', 'bench')).toBe('')
  })
})
