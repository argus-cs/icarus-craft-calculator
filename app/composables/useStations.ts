import type { Station, ItemsData } from '~/types'

export function useStations() {
  const data = ref<ItemsData | null>(null)

  const stations = computed(() => data.value?.stations ?? [])

  function findById(id: string): Station | undefined {
    return stations.value.find(s => s.id === id)
  }

  function setData(itemsData: ItemsData) {
    data.value = itemsData
  }

  return { stations, findById, setData }
}
