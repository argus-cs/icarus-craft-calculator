<script setup lang="ts">
const { filteredItems, category, query, load } = useItems()

onMounted(() => load())
</script>

<template>
  <div>
    <!-- Header -->
    <div class="px-4 pt-5 pb-4 border-b border-border-active" style="background: linear-gradient(180deg, rgba(140,135,60,0.35) 0%, rgba(140,135,60,0.15) 100%);">
      <h1 class="text-sm font-bold text-accent mb-3 uppercase tracking-[2px]">RECIPES</h1>
      <SearchBar v-model="query" />
    </div>

    <!-- Category filter -->
    <CategoryFilter v-model="category" />

    <!-- Item list -->
    <ItemList :items="filteredItems" />
  </div>
</template>
