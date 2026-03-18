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
  <div class="flex items-center">
    <button
      class="w-[30px] h-[28px] bg-[rgba(140,135,60,0.1)] border border-border-active text-accent flex items-center justify-center hover:bg-[rgba(140,135,60,0.2)] transition-colors font-bold text-sm"
      @click="decrement"
    >
      &lsaquo;
    </button>
    <span class="w-[44px] h-[28px] bg-[rgba(0,0,0,0.5)] border-y border-border-active text-accent font-bold text-base flex items-center justify-center">
      {{ model }}
    </span>
    <button
      class="w-[30px] h-[28px] bg-[rgba(140,135,60,0.1)] border border-border-active text-accent flex items-center justify-center hover:bg-[rgba(140,135,60,0.2)] transition-colors font-bold text-sm"
      @click="increment"
    >
      &rsaquo;
    </button>
  </div>
</template>
