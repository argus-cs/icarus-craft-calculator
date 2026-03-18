<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="relative">
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
      &#x1F50D;
    </span>
    <input
      :value="model"
      type="search"
      inputmode="search"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      placeholder="Buscar item..."
      class="w-full bg-bg-primary border border-border rounded-lg py-2 pl-9 pr-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
      @input="model = ($event.target as HTMLInputElement).value"
    />
  </div>
</template>
