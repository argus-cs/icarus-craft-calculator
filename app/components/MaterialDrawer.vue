<script setup lang="ts">
import type { Item, Station } from '~/types'
import type { ComputedMaterial } from '~/composables/useCraftCalculator'

const props = defineProps<{
  allItems: Item[]
  stations: Station[]
}>()

const isOpen = ref(false)
const navStack = ref<{ item: Item; quantity: number }[]>([])

const current = computed(() => navStack.value[navStack.value.length - 1] ?? null)
const canGoBack = computed(() => navStack.value.length > 1)

const { compute } = useCraftCalculator()

const materials = computed<ComputedMaterial[]>(() => {
  if (!current.value) return []
  return compute(current.value.item, current.value.quantity, props.allItems)
})

const craftingStations = computed<(Station | undefined)[]>(() => {
  if (!current.value) return []
  return current.value.item.craftedAt.map(id => props.stations.find(s => s.id === id))
})

const isBaseResource = computed(() => {
  if (!current.value) return false
  return current.value.item.materials.length === 0 && current.value.item.craftedAt.length === 0
})

function open(item: Item, quantity: number) {
  navStack.value = [{ item, quantity }]
  isOpen.value = true
}

function pushMaterial(mat: ComputedMaterial) {
  if (mat.item && mat.item.materials.length > 0) {
    navStack.value.push({ item: mat.item, quantity: mat.computedQuantity })
  }
}

function goBack() {
  if (navStack.value.length > 1) {
    navStack.value.pop()
  }
}

function close() {
  isOpen.value = false
  navStack.value = []
}

defineExpose({ open })
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/40 z-40"
        @click="close"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="slide-up">
      <div
        v-if="isOpen && current"
        class="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[480px]"
      >
        <div class="bg-bg-card rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] text-text-primary">
          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-2">
            <div class="w-10 h-1 bg-border rounded-full" />
          </div>

          <div class="px-4 pb-6 max-h-[70vh] overflow-y-auto">
            <!-- Header with back button -->
            <div class="flex items-center gap-2 mb-3">
              <button
                v-if="canGoBack"
                class="text-accent text-sm"
                @click="goBack"
              >
                ←
              </button>
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 bg-bg-input rounded-lg flex items-center justify-center shrink-0">
                  <img
                    v-if="current.item.icon"
                    :src="current.item.icon"
                    :alt="current.item.name"
                    class="w-full h-full object-contain rounded-lg"
                    referrerpolicy="no-referrer"
                    @error="($event.target as HTMLImageElement).style.display='none'"
                  />
                </div>
                <div>
                  <div class="font-bold text-[15px] text-text-primary">{{ current.item.name }}</div>
                  <div class="text-[11px] text-text-muted">{{ current.item.category }} • {{ current.item.tier ?? 'Base' }}</div>
                </div>
              </div>
            </div>

            <!-- Quantity -->
            <div class="bg-bg-primary rounded-lg p-3 mb-3 flex items-center justify-between">
              <span class="text-xs text-text-secondary">Quantidade</span>
              <span class="text-lg font-bold text-accent">{{ current.quantity }}</span>
            </div>

            <!-- Base resource message -->
            <div v-if="isBaseResource" class="bg-bg-primary rounded-lg p-4 text-center">
              <p class="text-sm text-text-secondary">Base resource — gathered in the world</p>
            </div>

            <!-- Materials -->
            <template v-else>
              <div v-if="materials.length > 0" class="mb-3">
                <p class="text-[11px] text-text-secondary uppercase tracking-wider mb-1.5">Materiais necessários</p>
                <div class="bg-bg-primary rounded-lg overflow-hidden divide-y divide-bg-card">
                  <MaterialRow
                    v-for="mat in materials"
                    :key="mat.item?.id ?? 'unknown'"
                    :item="mat.item"
                    :quantity="mat.computedQuantity"
                    @click="pushMaterial(mat)"
                  />
                </div>
              </div>

              <!-- Station -->
              <div v-if="craftingStations.length > 0">
                <p class="text-[11px] text-text-secondary uppercase tracking-wider mb-1.5">Estação de craft</p>
                <StationBadge
                  v-for="station in craftingStations"
                  :key="station?.id"
                  :station="station"
                  class="!bg-bg-primary"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
