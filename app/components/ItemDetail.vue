<script setup lang="ts">
import type { Item, Station } from '~/types'
import type { ComputedMaterial } from '~/composables/useCraftCalculator'

const props = defineProps<{
  item: Item
  stations: Station[]
  allItems: Item[]
}>()

const emit = defineEmits<{
  openMaterial: [item: Item, quantity: number]
}>()

const quantity = ref(1)
const { compute } = useCraftCalculator()

const materials = computed<ComputedMaterial[]>(() =>
  compute(props.item, quantity.value, props.allItems)
)

const craftingStations = computed<(Station | undefined)[]>(() =>
  props.item.craftedAt.map(id => props.stations.find(s => s.id === id))
)

const isBaseResource = computed(() =>
  props.item.materials.length === 0 && props.item.craftedAt.length === 0
)

function handleMaterialClick(mat: ComputedMaterial) {
  if (mat.item && mat.item.materials.length > 0) {
    emit('openMaterial', mat.item, mat.computedQuantity)
  }
}
</script>

<template>
  <div class="p-3">
    <!-- Item info with corner brackets -->
    <div class="relative bg-bg-card border border-border p-3 flex items-center gap-3 mb-3">
      <!-- Corner brackets -->
      <div class="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-border-active"></div>
      <div class="absolute -top-px -right-px w-2 h-2 border-t-2 border-r-2 border-border-active"></div>
      <div class="absolute -bottom-px -left-px w-2 h-2 border-b-2 border-l-2 border-border-active"></div>
      <div class="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-border-active"></div>

      <div class="w-[52px] h-[52px] bg-bg-input border border-border flex items-center justify-center shrink-0">
        <img
          v-if="item.icon"
          :src="item.icon"
          :alt="item.name"
          class="w-full h-full object-contain"
          referrerpolicy="no-referrer"
          @error="($event.target as HTMLImageElement).style.display='none'"
        />
      </div>
      <div>
        <h2 class="text-[15px] font-bold">{{ item.name }}</h2>
        <p class="text-[10px] text-text-muted uppercase tracking-[1px]">{{ item.category }} &bull; {{ item.tier ?? 'BASE' }}</p>
      </div>
    </div>

    <!-- Base resource message -->
    <div v-if="isBaseResource" class="bg-bg-card p-4 border border-border text-center">
      <p class="text-sm text-text-secondary">Base resource &mdash; gathered in the world</p>
    </div>

    <!-- Craftable item details -->
    <template v-else>
      <!-- Quantity -->
      <div class="bg-bg-card p-3 mb-3 flex items-center justify-between border border-border">
        <span class="text-[10px] text-text-secondary uppercase tracking-[1.5px]">QUANTITY</span>
        <QuantityInput v-model="quantity" />
      </div>

      <!-- Materials section bar -->
      <div v-if="materials.length > 0" class="mb-3">
        <div class="mb-1.5 py-1 px-2.5" style="background: linear-gradient(90deg, rgba(140,135,60,0.3) 0%, rgba(140,135,60,0.05) 100%);">
          <span class="text-[10px] text-accent uppercase tracking-[1.5px] font-semibold">REQUIRED ELEMENTS</span>
        </div>
        <div class="bg-bg-card border border-border overflow-hidden divide-y divide-[rgba(140,135,60,0.1)]">
          <MaterialRow
            v-for="mat in materials"
            :key="mat.item?.id ?? 'unknown'"
            :item="mat.item"
            :quantity="mat.computedQuantity"
            :base-quantity="mat.baseQuantity"
            @click="handleMaterialClick(mat)"
          />
        </div>
      </div>

      <!-- Stations section bar -->
      <div v-if="craftingStations.length > 0">
        <div class="mb-1.5 py-1 px-2.5" style="background: linear-gradient(90deg, rgba(140,135,60,0.3) 0%, rgba(140,135,60,0.05) 100%);">
          <span class="text-[10px] text-accent uppercase tracking-[1.5px] font-semibold">CRAFTING STATION</span>
        </div>
        <StationBadge
          v-for="station in craftingStations"
          :key="station?.id"
          :station="station"
          :all-items="allItems"
        />
      </div>
    </template>
  </div>
</template>
