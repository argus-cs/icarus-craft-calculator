<script setup lang="ts">
import type { Category } from '~/types'

const model = defineModel<Category | null>({ default: null })

const categories: { value: Category | null; label: string }[] = [
  { value: null, label: 'ALL' },
  { value: 'tools', label: 'TOOLS' },
  { value: 'constructions', label: 'BUILD' },
  { value: 'deployables', label: 'DEPLOY' },
  { value: 'resources', label: 'RES' },
]
</script>

<template>
  <div class="flex border-b border-border" style="background: rgba(15,18,10,0.6);">
    <button
      v-for="cat in categories"
      :key="cat.value ?? 'all'"
      class="flex-1 py-2.5 text-[10px] text-center transition-colors tracking-[1.2px]"
      :class="model === cat.value
        ? 'text-accent border-b-2 border-accent font-bold'
        : 'text-text-muted hover:text-text-secondary'"
      @click="model = cat.value"
    >
      {{ cat.label }}
    </button>
  </div>
</template>
