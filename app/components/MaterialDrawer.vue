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
  document.body.style.overflow = 'hidden'
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
  document.body.style.overflow = ''
}

// Touch swipe to dismiss
const drawerRef = ref<HTMLElement | null>(null)
const dragOffset = ref(0)
const isDragging = ref(false)
let startY = 0

function onTouchStart(e: TouchEvent) {
  startY = e.touches[0].clientY
  isDragging.value = true
  dragOffset.value = 0
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  const dy = e.touches[0].clientY - startY
  // Only allow dragging down
  dragOffset.value = Math.max(0, dy)
  if (dragOffset.value > 0) {
    e.preventDefault()
  }
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  // Close if dragged more than 100px down
  if (dragOffset.value > 100) {
    close()
  }
  dragOffset.value = 0
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
        ref="drawerRef"
        class="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[480px]"
        :style="{ transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined }"
      >
        <div class="bg-bg-card rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] text-text-primary">
          <!-- Header (swipe area) -->
          <div
            class="cursor-grab touch-none"
            @touchstart="onTouchStart"
            @touchmove.passive="onTouchMove"
            @touchend="onTouchEnd"
          >
            <!-- Handle -->
            <div class="flex justify-center pt-3 pb-2">
              <div class="w-10 h-1 bg-border rounded-full" />
            </div>

            <!-- Item info + back button -->
            <div class="flex items-center gap-2 px-4 pb-3">
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
          </div>

          <div class="px-4 pb-6 max-h-[70vh] overflow-y-auto">

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
                    :base-quantity="mat.baseQuantity"
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
                  :all-items="allItems"
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
