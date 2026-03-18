<script setup lang="ts">
const route = useRoute()
const { load, findById, items, data } = useItems()

await load()

const item = computed(() => findById(route.params.id as string))
const stations = computed(() => data.value?.stations ?? [])

const drawerRef = ref<InstanceType<typeof MaterialDrawer> | null>(null)

function openMaterial(materialItem: import('~/types').Item, quantity: number) {
  drawerRef.value?.open(materialItem, quantity)
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="bg-bg-card p-3 border-b border-border flex items-center gap-3">
      <NuxtLink to="/" class="text-accent text-base">←</NuxtLink>
      <span class="text-sm font-bold">{{ item?.name ?? 'Not found' }}</span>
      <span
        v-if="item?.tier"
        class="ml-auto text-[11px] text-text-muted bg-bg-input px-2 py-0.5 rounded"
      >
        {{ item.tier }}
      </span>
    </div>

    <!-- Detail -->
    <ItemDetail
      v-if="item"
      :item="item"
      :stations="stations"
      :all-items="items"
      @open-material="openMaterial"
    />

    <div v-else class="p-8 text-center text-text-muted">
      Item não encontrado.
    </div>

    <!-- Material drawer -->
    <MaterialDrawer
      ref="drawerRef"
      :all-items="items"
      :stations="stations"
    />
  </div>
</template>
