import { describe, it, expect } from 'vitest'
import { ItemsDataSchema } from '../../scripts/utils/schema'

describe('ItemsDataSchema', () => {
  it('validates a correct items.json structure', () => {
    const valid = {
      version: '1.0.0',
      generatedAt: '2026-03-18T12:00:00Z',
      items: [
        {
          id: 'stone-pickaxe',
          name: 'Stone Pickaxe',
          category: 'tools',
          tier: 'tier-1',
          icon: '/icons/stone-pickaxe.png',
          craftedAt: ['crafting-bench'],
          materials: [
            { itemId: 'stone', quantity: 10 },
            { itemId: 'wood', quantity: 4 },
          ],
        },
        {
          id: 'wood',
          name: 'Wood',
          category: 'resources',
          tier: null,
          icon: '/icons/wood.png',
          craftedAt: [],
          materials: [],
        },
      ],
      stations: [
        {
          id: 'crafting-bench',
          name: 'Crafting Bench',
          category: 'deployables',
          tier: 'tier-1',
        },
      ],
    }

    const result = ItemsDataSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects invalid category', () => {
    const invalid = {
      version: '1.0.0',
      generatedAt: '2026-03-18T12:00:00Z',
      items: [
        {
          id: 'test',
          name: 'Test',
          category: 'invalid',
          tier: null,
          icon: '',
          craftedAt: [],
          materials: [],
        },
      ],
      stations: [],
    }

    const result = ItemsDataSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('rejects empty items array', () => {
    const empty = {
      version: '1.0.0',
      generatedAt: '2026-03-18T12:00:00Z',
      items: [],
      stations: [],
    }

    const result = ItemsDataSchema.safeParse(empty)
    expect(result.success).toBe(false)
  })
})
