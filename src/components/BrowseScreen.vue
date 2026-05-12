<script setup lang="ts">
import type { Lesson } from '@/types/vocab'

defineProps<{
  lessons: Lesson[]
}>()

defineEmits<{
  back: []
  open: [n: number]
}>()
</script>

<template>
  <div>
    <div class="mb-3 flex items-center gap-2">
      <button
        class="cursor-pointer rounded-lg border border-stone-200 bg-transparent px-3 py-2 text-[13px] text-stone-900 dark:border-neutral-700 dark:text-neutral-100"
        @click="$emit('back')"
      >
        ‹ Orqaga
      </button>
    </div>

    <div
      class="mb-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
    >
      <h2
        class="mb-2.5 text-[14px] font-medium uppercase tracking-wider text-stone-500 dark:text-neutral-400"
      >
        Darsni tanlang
      </h2>
      <div class="flex flex-col gap-3">
        <button
          v-for="lesson in lessons"
          :key="lesson.number"
          class="w-full cursor-pointer rounded-xl border border-stone-200 bg-white p-4 text-left text-stone-900 transition-transform active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          @click="$emit('open', lesson.number)"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-base font-semibold">
                Dars {{ lesson.number }}: {{ lesson.titleUz }}
              </div>
              <div class="text-[13px] text-stone-500 dark:text-neutral-400">
                {{ lesson.words.length }} ta so'z
              </div>
            </div>
            <div class="text-lg text-stone-400 dark:text-neutral-500">›</div>
          </div>
          <div class="arabic-text mt-1.5 text-xl text-brand-600 dark:text-brand-400">
            {{ lesson.titleAr }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
