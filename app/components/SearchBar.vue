<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div>
    <input
      :value="model"
      type="search"
      inputmode="search"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      placeholder="Search..."
      class="w-full bg-[rgba(0,0,0,0.5)] border border-border py-2 px-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active"
      @input="model = ($event.target as HTMLInputElement).value"
    />
  </div>
</template>
