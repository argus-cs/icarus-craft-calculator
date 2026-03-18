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
  <div class="p-4">
    <!-- Item info -->
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 bg-bg-card rounded-lg flex items-center justify-center border border-border shrink-0">
        <img
          v-if="item.icon"
          :src="item.icon"
          :alt="item.name"
          class="w-full h-full object-contain rounded-lg"
          @error="($event.target as HTMLImageElement).style.display='none'"
        />
      </div>
      <div>
        <h2 class="text-base font-bold">{{ item.name }}</h2>
        <p class="text-xs text-text-muted">{{ item.category }} • {{ item.tier ?? 'Base' }}</p>
      </div>
    </div>

    <!-- Base resource message -->
    <div v-if="isBaseResource" class="bg-bg-card rounded-lg p-4 border border-border text-center">
      <p class="text-sm text-text-secondary">Base resource — gathered in the world</p>
    </div>

    <!-- Craftable item details -->
    <template v-else>
      <!-- Quantity -->
      <div class="bg-bg-card rounded-lg p-3 mb-4 flex items-center justify-between border border-border">
        <span class="text-xs text-text-secondary">Quantidade</span>
        <QuantityInput v-model="quantity" />
      </div>

      <!-- Materials -->
      <div v-if="materials.length > 0" class="mb-4">
        <p class="text-[11px] text-text-secondary uppercase tracking-wider mb-2">Materiais necessários</p>
        <div class="bg-bg-card rounded-lg border border-border overflow-hidden divide-y divide-bg-primary">
          <MaterialRow
            v-for="mat in materials"
            :key="mat.item?.id ?? 'unknown'"
            :item="mat.item"
            :quantity="mat.computedQuantity"
            @click="handleMaterialClick(mat)"
          />
        </div>
      </div>

      <!-- Stations -->
      <div v-if="craftingStations.length > 0">
        <p class="text-[11px] text-text-secondary uppercase tracking-wider mb-2">Estação de craft</p>
        <StationBadge
          v-for="station in craftingStations"
          :key="station?.id"
          :station="station"
        />
      </div>
    </template>
  </div>
</template>
