export type Category = 'tools' | 'constructions' | 'deployables' | 'resources'

export interface Material {
  itemId: string
  quantity: number
}

export interface Item {
  id: string
  name: string
  category: Category
  tier: string | null
  icon: string
  craftedAt: string[]
  materials: Material[]
}

export interface Station {
  id: string
  name: string
  category: string
  tier: string
}

export interface ItemsData {
  version: string
  generatedAt: string
  items: Item[]
  stations: Station[]
}
