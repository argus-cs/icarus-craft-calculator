<script setup lang="ts">
import type { Item } from '~/types'

defineProps<{
  items: Item[]
}>()
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <ItemCard v-for="item in items" :key="item.id" :item="item" />
    <p v-if="items.length === 0" class="text-center text-text-muted text-sm py-8">
      Nenhum item encontrado.
    </p>
  </div>
</template>
