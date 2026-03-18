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
  dragOffset.value = Math.max(0, dy)
  if (dragOffset.value > 0) {
    e.preventDefault()
  }
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false
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
        class="fixed inset-0 bg-black/50 z-40"
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
        <div class="bg-bg-primary text-text-primary border-t-2 border-border-active shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
          <!-- Header (swipe area) -->
          <div
            class="cursor-grab touch-none"
            @touchstart="onTouchStart"
            @touchmove.passive="onTouchMove"
            @touchend="onTouchEnd"
          >
            <!-- Handle -->
            <div class="flex justify-center pt-3 pb-2">
              <div class="w-9 h-[3px] bg-border-active" />
            </div>

            <!-- Item info + back button with corner brackets -->
            <div class="flex items-center gap-2.5 px-3 pb-3">
              <button
                v-if="canGoBack"
                class="text-accent text-sm"
                @click="goBack"
              >
                &#8592;
              </button>
              <div class="relative flex-1 bg-bg-card border border-border p-2.5 flex items-center gap-2.5">
                <!-- Corner brackets -->
                <div class="absolute -top-px -left-px w-[7px] h-[7px] border-t-2 border-l-2 border-border-active"></div>
                <div class="absolute -top-px -right-px w-[7px] h-[7px] border-t-2 border-r-2 border-border-active"></div>
                <div class="absolute -bottom-px -left-px w-[7px] h-[7px] border-b-2 border-l-2 border-border-active"></div>
                <div class="absolute -bottom-px -right-px w-[7px] h-[7px] border-b-2 border-r-2 border-border-active"></div>

                <div class="w-9 h-9 bg-bg-input border border-border flex items-center justify-center shrink-0">
                  <img
                    v-if="current.item.icon"
                    :src="current.item.icon"
                    :alt="current.item.name"
                    class="w-full h-full object-contain"
                    referrerpolicy="no-referrer"
                    @error="($event.target as HTMLImageElement).style.display='none'"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-bold text-[14px] text-text-primary truncate">{{ current.item.name }}</div>
                  <div class="text-[10px] text-text-muted uppercase tracking-[1px]">{{ current.item.category }} &bull; {{ current.item.tier ?? 'BASE' }}</div>
                </div>
                <div class="text-accent font-bold text-base shrink-0">&times;{{ current.quantity }}</div>
              </div>
            </div>
          </div>

          <div class="px-3 pb-5 max-h-[70vh] overflow-y-auto">

            <!-- Quantity display -->
            <div class="bg-bg-card border border-border p-3 mb-3 flex items-center justify-between">
              <span class="text-[10px] text-text-secondary uppercase tracking-[1.5px]">QUANTITY</span>
              <span class="text-lg font-bold text-accent">{{ current.quantity }}</span>
            </div>

            <!-- Base resource message -->
            <div v-if="isBaseResource" class="bg-bg-card border border-border p-4 text-center">
              <p class="text-sm text-text-secondary">Base resource &mdash; gathered in the world</p>
            </div>

            <!-- Materials -->
            <template v-else>
              <div v-if="materials.length > 0" class="mb-3">
                <div class="mb-1.5 py-1 px-2.5" style="background: linear-gradient(90deg, rgba(140,135,60,0.3) 0%, rgba(140,135,60,0.05) 100%);">
                  <span class="text-[9px] text-accent uppercase tracking-[1.5px] font-semibold">REQUIRED ELEMENTS</span>
                </div>
                <div class="bg-bg-card border border-border overflow-hidden divide-y divide-[rgba(140,135,60,0.1)]">
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
                <div class="mb-1.5 py-1 px-2.5" style="background: linear-gradient(90deg, rgba(140,135,60,0.3) 0%, rgba(140,135,60,0.05) 100%);">
                  <span class="text-[9px] text-accent uppercase tracking-[1.5px] font-semibold">CRAFTING STATION</span>
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
