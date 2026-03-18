import type { Item, Category, ItemsData } from '~/types'

// Pure functions (exported for testing)
export function filterItems(items: Item[], category: Category | null): Item[] {
  if (!category) return items
  return items.filter(item => item.category === category)
}

export function searchItems(items: Item[], query: string): Item[] {
  if (!query.trim()) return items
  const lower = query.toLowerCase()
  return items.filter(item => item.name.toLowerCase().includes(lower))
}

export function findItemById(items: Item[], id: string): Item | undefined {
  return items.find(item => item.id === id)
}

// Composable
export function useItems() {
  const data = ref<ItemsData | null>(null)
  const category = ref<Category | null>('tools')
  const query = ref('')

  const items = computed(() => data.value?.items ?? [])

  const filteredItems = computed(() => {
    let result = filterItems(items.value, category.value)
    result = searchItems(result, query.value)
    return result
  })

  async function load() {
    if (data.value) return
    const config = useRuntimeConfig()
    const baseURL = config.app.baseURL || '/'
    const response = await $fetch<ItemsData>(`${baseURL}data/items.json`)
    data.value = response
  }

  function findById(id: string): Item | undefined {
    return findItemById(items.value, id)
  }

  return {
    data,
    items,
    filteredItems,
    category,
    query,
    load,
    findById,
  }
}
