<script setup lang="ts">
const model = defineModel<number>({ default: 1 })

function decrement() {
  if (model.value > 1) model.value--
}

function increment() {
  model.value++
}
</script>

<template>
  <div class="flex items-center gap-3">
    <button
      class="w-8 h-8 rounded-md bg-bg-input border border-border text-text-primary flex items-center justify-center hover:border-accent transition-colors"
      @click="decrement"
    >
      −
    </button>
    <span class="text-xl font-bold text-accent min-w-[24px] text-center">
      {{ model }}
    </span>
    <button
      class="w-8 h-8 rounded-md bg-bg-input border border-border text-text-primary flex items-center justify-center hover:border-accent transition-colors"
      @click="increment"
    >
      +
    </button>
  </div>
</template>
