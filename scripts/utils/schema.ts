import { z } from 'zod'

const CategorySchema = z.enum(['tools', 'constructions', 'deployables', 'resources'])

const MaterialSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
})

const ItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: CategorySchema,
  tier: z.string().nullable(),
  icon: z.string(),
  craftedAt: z.array(z.string()),
  materials: z.array(MaterialSchema),
})

const StationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  tier: z.string().min(1),
})

export const ItemsDataSchema = z.object({
  version: z.string().min(1),
  generatedAt: z.string().min(1),
  items: z.array(ItemSchema).min(1, 'At least one item is required'),
  stations: z.array(StationSchema),
})

export type { z }
