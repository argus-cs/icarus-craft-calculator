import { describe, it, expect } from 'vitest'
import { slugify, parseQuantity, cleanText } from '../../scripts/utils/parser'

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
