import { describe, it, expect } from 'vitest'
import { calculateMaterials } from '../../app/composables/useCraftCalculator'
import type { Item } from '../../app/types'

const mockItems: Item[] = [
  {
    id: 'iron-pickaxe', name: 'Iron Pickaxe', category: 'tools', tier: 'tier-2', icon: '',
    craftedAt: ['anvil-bench'],
    materials: [
      { itemId: 'iron-ingot', quantity: 6 },
      { itemId: 'wood', quantity: 4 },
    ],
  },
  {
    id: 'iron-ingot', name: 'Iron Ingot', category: 'resources', tier: 'tier-2', icon: '',
    craftedAt: ['stone-furnace'],
    materials: [{ itemId: 'iron-ore', quantity: 2 }],
  },
  {
    id: 'wood', name: 'Wood', category: 'resources', tier: null, icon: '',
    craftedAt: [], materials: [],
  },
]

describe('calculateMaterials', () => {
  it('returns materials with computed quantities for qty=1', () => {
    const result = calculateMaterials(mockItems[0], 1, mockItems)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ item: mockItems[1], computedQuantity: 6 })
    expect(result[1]).toEqual({ item: mockItems[2], computedQuantity: 4 })
  })

  it('multiplies quantities by desired amount', () => {
    const result = calculateMaterials(mockItems[0], 3, mockItems)
    expect(result[0].computedQuantity).toBe(18)
    expect(result[1].computedQuantity).toBe(12)
  })

  it('returns empty array for items with no materials', () => {
    const result = calculateMaterials(mockItems[2], 5, mockItems)
    expect(result).toHaveLength(0)
  })

  it('handles missing material reference gracefully', () => {
    const itemWithMissing: Item = {
      id: 'test', name: 'Test', category: 'tools', tier: null, icon: '',
      craftedAt: [],
      materials: [{ itemId: 'nonexistent', quantity: 5 }],
    }
    const result = calculateMaterials(itemWithMissing, 1, mockItems)
    expect(result).toHaveLength(1)
    expect(result[0].item).toBeUndefined()
    expect(result[0].computedQuantity).toBe(5)
  })
})
