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
    class="bg-bg-card p-3 flex items-center gap-2.5 border border-border"
  >
    <div class="w-7 h-7 bg-bg-input border border-border flex items-center justify-center shrink-0">
      <img
        v-if="getStationIcon(station.id, allItems)"
        :src="getStationIcon(station.id, allItems)"
        :alt="station.name"
        class="w-full h-full object-contain"
        referrerpolicy="no-referrer"
        @error="($event.target as HTMLImageElement).style.display='none'"
      />
      <span v-else class="text-[10px] text-text-muted">&#x2699;</span>
    </div>
    <span class="text-sm text-[#c8c090]">{{ station.name }}</span>
    <span
      v-if="station.tier"
      class="ml-auto text-[9px] text-text-muted bg-bg-input border border-border px-2 py-0.5 uppercase tracking-[0.5px]"
    >
      {{ station.tier }}
    </span>
  </div>
</template>
