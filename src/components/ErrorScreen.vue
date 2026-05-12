<script setup lang="ts">
defineProps<{
  error: string
}>()

function reload() {
  window.location.reload()
}
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
    <div class="text-5xl">⚠️</div>
    <div class="font-semibold">Xatolik yuz berdi</div>
    <div class="text-sm text-stone-500 dark:text-neutral-400">{{ error }}</div>
    <button
      class="mt-2 max-w-[200px] cursor-pointer rounded-xl border-0 bg-brand-500 px-5 py-3.5 text-base font-medium text-white active:scale-[0.98] active:bg-brand-600"
      @click="reload"
    >
      Qayta urinish
    </button>
  </div>
</template>
