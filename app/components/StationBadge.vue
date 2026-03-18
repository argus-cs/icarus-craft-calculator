<script setup lang="ts">
import type { Station } from '~/types'

defineProps<{
  station: Station | undefined
}>()
</script>

<template>
  <div
    v-if="station"
    class="bg-bg-card rounded-lg p-3 flex items-center gap-2 border border-border"
  >
    <span class="text-sm">⚙</span>
    <span class="text-sm">{{ station.name }}</span>
    <span
      v-if="station.tier"
      class="ml-auto text-[10px] text-text-muted bg-bg-input px-2 py-0.5 rounded"
    >
      {{ station.tier }}
    </span>
  </div>
</template>
