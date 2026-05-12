<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  sessionCorrect: number
  sessionWrong: number
  total: number
  useMistakes: boolean
  mistakesCount: number
}>()

defineEmits<{
  restart: []
  home: []
  practiceMistakes: []
}>()

const percent = computed(() =>
  Math.round((props.sessionCorrect / Math.max(props.total, 1)) * 100),
)
</script>

<template>
  <div>
    <div
      class="mb-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
    >
      <div class="px-4 py-8 text-center">
        <div class="mb-2 text-6xl font-semibold text-brand-500">
          {{ sessionCorrect }}
        </div>
        <div>to'g'ri javob {{ total }} tadan</div>
        <div class="text-lg text-stone-500 dark:text-neutral-400">
          {{ percent }}%
        </div>
        <div
          v-if="sessionWrong > 0"
          class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
        >
          {{ sessionWrong }} ta xato qilingan so'z xatolar ro'yxatiga qo'shildi
        </div>
      </div>
    </div>

    <button
      class="w-full cursor-pointer rounded-xl border-0 bg-brand-500 px-5 py-3.5 text-base font-medium text-white active:scale-[0.98] active:bg-brand-600"
      @click="$emit('restart')"
    >
      Yana boshlash
    </button>

    <div class="mt-3 flex gap-2">
      <button
        class="flex-1 cursor-pointer rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-base font-medium text-stone-900 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        @click="$emit('home')"
      >
        Asosiy
      </button>
      <button
        v-if="!useMistakes && mistakesCount > 0"
        class="flex-1 cursor-pointer rounded-xl border-0 bg-amber-500 px-5 py-3.5 text-base font-medium text-white active:scale-[0.98]"
        @click="$emit('practiceMistakes')"
      >
        Xatolarni mashq qilish ({{ mistakesCount }})
      </button>
    </div>
  </div>
</template>
