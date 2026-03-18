<script setup lang="ts">
import type { Station, Item } from '~/types'

defineProps<{
  station: Station | undefined
  allItems?: Item[]
}>()

function getStationIcon(stationId: string, items?: Item[]): string {
  if (!items) return ''
  const item = items.find(i => i.id === stationId)
  return item?.icon ?? ''
}
</script>

<template>
  <div
    v-if="station"
    class="bg-bg-card rounded-lg p-3 flex items-center gap-2 border border-border"
  >
    <div class="w-6 h-6 bg-bg-input rounded flex items-center justify-center shrink-0">
      <img
        v-if="getStationIcon(station.id, allItems)"
        :src="getStationIcon(station.id, allItems)"
        :alt="station.name"
        class="w-full h-full object-contain rounded"
        referrerpolicy="no-referrer"
        @error="($event.target as HTMLImageElement).style.display='none'"
      />
      <span v-else class="text-xs">⚙</span>
    </div>
    <span class="text-sm">{{ station.name }}</span>
    <span
      v-if="station.tier"
      class="ml-auto text-[10px] text-text-muted bg-bg-input px-2 py-0.5 rounded"
    >
      {{ station.tier }}
    </span>
  </div>
</template>
