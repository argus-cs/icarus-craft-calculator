import { describe, it, expect } from 'vitest'
import { filterItems, searchItems, findItemById } from '../../app/composables/useItems'
import type { Item } from '../../app/types'

const mockItems: Item[] = [
  { id: 'stone-pickaxe', name: 'Stone Pickaxe', category: 'tools', tier: 'tier-1', icon: '', craftedAt: [], materials: [] },
  { id: 'iron-pickaxe', name: 'Iron Pickaxe', category: 'tools', tier: 'tier-2', icon: '', craftedAt: [], materials: [] },
  { id: 'wood-wall', name: 'Wood Wall', category: 'constructions', tier: 'tier-1', icon: '', craftedAt: [], materials: [] },
  { id: 'stone-furnace', name: 'Stone Furnace', category: 'deployables', tier: 'tier-1', icon: '', craftedAt: [], materials: [] },
  { id: 'wood', name: 'Wood', category: 'resources', tier: null, icon: '', craftedAt: [], materials: [] },
]

describe('filterItems', () => {
  it('filters by category', () => {
    const result = filterItems(mockItems, 'tools')
    expect(result).toHaveLength(2)
    expect(result.every(i => i.category === 'tools')).toBe(true)
  })

  it('returns all items when category is null', () => {
    const result = filterItems(mockItems, null)
    expect(result).toHaveLength(5)
  })
})

describe('searchItems', () => {
  it('searches by name (case-insensitive)', () => {
    const result = searchItems(mockItems, 'pickaxe')
    expect(result).toHaveLength(2)
  })

  it('returns all items for empty query', () => {
    const result = searchItems(mockItems, '')
    expect(result).toHaveLength(5)
  })

  it('returns empty array for no match', () => {
    const result = searchItems(mockItems, 'zzzzz')
    expect(result).toHaveLength(0)
  })
})

describe('findItemById', () => {
  it('finds item by id', () => {
    const item = findItemById(mockItems, 'stone-pickaxe')
    expect(item?.name).toBe('Stone Pickaxe')
  })

  it('returns undefined for unknown id', () => {
    const item = findItemById(mockItems, 'nonexistent')
    expect(item).toBeUndefined()
  })
})
