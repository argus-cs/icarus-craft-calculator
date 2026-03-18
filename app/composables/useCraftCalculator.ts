import type { Item } from '~/types'

export interface ComputedMaterial {
  item: Item | undefined
  computedQuantity: number
}

export function calculateMaterials(
  item: Item,
  quantity: number,
  allItems: Item[],
): ComputedMaterial[] {
  return item.materials.map(mat => ({
    item: allItems.find(i => i.id === mat.itemId),
    computedQuantity: mat.quantity * quantity,
  }))
}

export function useCraftCalculator() {
  function compute(item: Item, quantity: number, allItems: Item[]): ComputedMaterial[] {
    return calculateMaterials(item, quantity, allItems)
  }

  return { compute }
}
