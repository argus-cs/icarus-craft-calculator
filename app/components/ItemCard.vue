<script setup lang="ts">
import type { Item } from '~/types'

defineProps<{
  item: Item
}>()
</script>

<template>
  <NuxtLink
    :to="`/items/${item.id}`"
    class="bg-bg-card p-3 flex items-center gap-3 border border-border hover:border-select hover:bg-select-bg transition-colors"
  >
    <div class="w-10 h-10 bg-bg-input border border-border flex items-center justify-center shrink-0">
      <img
        v-if="item.icon"
        :src="item.icon"
        :alt="item.name"
        class="w-full h-full object-contain"
        referrerpolicy="no-referrer"
        @error="($event.target as HTMLImageElement).style.display='none'"
      />
    </div>
    <div class="min-w-0">
      <div class="text-sm font-semibold truncate">{{ item.name }}</div>
      <div class="text-[10px] text-text-muted uppercase tracking-[0.8px]">
        {{ item.tier ?? 'BASE' }} &bull; {{ item.materials.length }} MATERIALS
      </div>
    </div>
    <span class="ml-auto text-text-muted text-base shrink-0">&rsaquo;</span>
  </NuxtLink>
</template>
