<script setup lang="ts">
import type { Item } from '~/types'

const props = defineProps<{
  item: Item | undefined
  quantity: number
  baseQuantity?: number
}>()

const emit = defineEmits<{
  click: []
}>()

const isCraftable = computed(() => props.item && props.item.materials.length > 0)
const showBase = computed(() => props.baseQuantity !== undefined && props.baseQuantity !== props.quantity)
</script>

<template>
  <button
    class="w-full p-3 flex items-center justify-between text-left"
    :class="isCraftable ? 'cursor-pointer hover:bg-bg-primary/50' : 'cursor-default'"
    @click="isCraftable && emit('click')"
  >
    <div class="flex items-center gap-2">
      <div class="w-6 h-6 bg-bg-input rounded flex items-center justify-center shrink-0">
        <img
          v-if="item?.icon"
          :src="item.icon"
          :alt="item?.name"
          class="w-full h-full object-contain rounded"
          referrerpolicy="no-referrer"
          @error="($event.target as HTMLImageElement).style.display='none'"
        />
      </div>
      <span class="text-sm">{{ item?.name ?? 'Unknown' }}</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span v-if="showBase" class="text-text-muted text-xs">{{ baseQuantity }}</span>
      <span v-if="showBase" class="text-text-muted text-xs">→</span>
      <span class="text-accent font-bold text-sm">×{{ quantity }}</span>
      <span v-if="isCraftable" class="text-border text-sm">›</span>
    </div>
  </button>
</template>
