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
    :class="isCraftable ? 'cursor-pointer hover:bg-[rgba(80,180,220,0.05)]' : 'cursor-default'"
    @click="isCraftable && emit('click')"
  >
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 bg-bg-input border border-border flex items-center justify-center shrink-0">
        <img
          v-if="item?.icon"
          :src="item.icon"
          :alt="item?.name"
          class="w-full h-full object-contain"
          referrerpolicy="no-referrer"
          @error="($event.target as HTMLImageElement).style.display='none'"
        />
      </div>
      <span class="text-sm text-[#c8c090]">{{ item?.name ?? 'Unknown' }}</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span v-if="showBase" class="text-text-muted text-xs">{{ baseQuantity }} &rarr;</span>
      <span class="text-accent font-bold text-sm">&times;{{ quantity }}</span>
      <span v-if="isCraftable" class="text-text-muted text-sm ml-1">&rsaquo;</span>
    </div>
  </button>
</template>
