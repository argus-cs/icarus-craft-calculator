<script setup lang="ts">
const { filteredItems, category, query, load } = useItems()

onMounted(() => load())
</script>

<template>
  <div>
    <!-- Header -->
    <div class="bg-bg-card p-4 border-b border-border">
      <h1 class="text-sm font-bold text-accent mb-2">⚒ Icarus Craft Calculator</h1>
      <SearchBar v-model="query" />
    </div>

    <!-- Category filter -->
    <CategoryFilter v-model="category" />

    <!-- Item list -->
    <ItemList :items="filteredItems" />
  </div>
</template>
