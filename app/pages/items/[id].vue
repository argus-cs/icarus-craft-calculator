<script setup lang="ts">
const route = useRoute()
const { load, findById, items, data } = useItems()

onMounted(() => load())

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
    <div class="p-3 border-b border-border-active flex items-center gap-3" style="background: linear-gradient(180deg, rgba(140,135,60,0.35) 0%, rgba(140,135,60,0.15) 100%);">
      <NuxtLink to="/" class="text-accent text-base">&#8592;</NuxtLink>
      <span class="text-xs font-bold uppercase tracking-[1.5px]">{{ item?.name ?? 'Not found' }}</span>
      <span
        v-if="item?.tier"
        class="ml-auto text-[9px] text-text-muted bg-bg-input border border-border px-2 py-0.5 uppercase tracking-[1px]"
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
