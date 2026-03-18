<script setup lang="ts">
import type { Category } from '~/types'

const model = defineModel<Category | null>({ default: null })

const categories: { value: Category | null; label: string }[] = [
  { value: null, label: 'Todos' },
  { value: 'tools', label: 'Ferramentas' },
  { value: 'constructions', label: 'Construções' },
  { value: 'deployables', label: 'Deployables' },
  { value: 'resources', label: 'Recursos' },
]
</script>

<template>
  <div class="flex border-b border-border">
    <button
      v-for="cat in categories"
      :key="cat.value ?? 'all'"
      class="flex-1 py-2 text-xs text-center transition-colors"
      :class="model === cat.value
        ? 'text-accent border-b-2 border-accent font-bold'
        : 'text-text-muted hover:text-text-secondary'"
      @click="model = cat.value"
    >
      {{ cat.label }}
    </button>
  </div>
</template>
