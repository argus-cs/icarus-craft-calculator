<script setup lang="ts">
import type { Item } from '~/types'

defineProps<{
  item: Item
}>()
</script>

<template>
  <NuxtLink
    :to="`/items/${item.id}`"
    class="bg-bg-card rounded-lg p-3 flex items-center gap-3 border border-border hover:border-accent transition-colors"
  >
    <div class="w-8 h-8 bg-bg-input rounded flex items-center justify-center text-base shrink-0">
      <img
        v-if="item.icon"
        :src="item.icon"
        :alt="item.name"
        class="w-full h-full object-contain rounded"
        @error="($event.target as HTMLImageElement).style.display='none'"
      />
    </div>
    <div class="min-w-0">
      <div class="text-sm font-bold truncate">{{ item.name }}</div>
      <div class="text-[10px] text-text-muted">
        {{ item.tier ?? 'Base' }} • {{ item.materials.length }} materiais
      </div>
    </div>
    <span class="ml-auto text-border text-base shrink-0">›</span>
  </NuxtLink>
</template>
