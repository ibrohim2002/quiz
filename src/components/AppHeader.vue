<script setup lang="ts">
defineProps<{
  currentVersion: string
  totalCorrect: number
  totalWrong: number
  showStats: boolean
}>()
</script>

<template>
  <header
    class="mb-4 flex items-center justify-between border-b border-stone-200 pb-3 dark:border-neutral-800"
  >
    <div class="flex items-baseline gap-2">
      <h1 class="text-lg font-semibold text-brand-600 dark:text-brand-400">
        Al-Mumtaz · Quiz
      </h1>
      <span
        v-if="currentVersion !== '?'"
        class="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-500 dark:bg-neutral-800 dark:text-neutral-400"
      >
        v{{ currentVersion }}
      </span>
    </div>
    <div v-if="showStats" class="flex gap-1.5 text-[13px]">
      <span
        class="flex items-center gap-1 rounded-full border border-green-600 px-2.5 py-1 text-green-700 dark:text-green-400"
      >
        {{ totalCorrect }} ✓
      </span>
      <span
        class="flex items-center gap-1 rounded-full border border-red-600 px-2.5 py-1 text-red-700 dark:text-red-400"
      >
        {{ totalWrong }} ✗
      </span>
    </div>
  </header>
</template>
