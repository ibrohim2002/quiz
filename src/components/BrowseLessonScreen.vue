<script setup lang="ts">
import type { Lesson } from '@/types/vocab'

defineProps<{
  lesson: Lesson
}>()

defineEmits<{
  back: []
  speak: [text: string]
}>()
</script>

<template>
  <div>
    <div class="mb-3 flex items-center gap-2">
      <button
        class="cursor-pointer rounded-lg border border-stone-200 bg-transparent px-3 py-2 text-[13px] text-stone-900 dark:border-neutral-700 dark:text-neutral-100"
        @click="$emit('back')"
      >
        ‹ Darslar
      </button>
    </div>

    <div
      class="mb-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
    >
      <h2
        class="mb-2.5 text-[14px] font-medium uppercase tracking-wider text-stone-500 dark:text-neutral-400"
      >
        Dars {{ lesson.number }}: {{ lesson.titleUz }}
      </h2>
      <div class="flex flex-col gap-2">
        <div
          v-for="(w, i) in lesson.words"
          :key="i"
          class="grid grid-cols-2 items-center gap-3 rounded-[10px] border border-stone-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div
            class="arabic-text cursor-pointer text-right text-2xl"
            @click="$emit('speak', w.ar)"
          >
            {{ w.ar }}
          </div>
          <div>
            <span
              class="mb-1 inline-block rounded bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-500 dark:bg-neutral-700 dark:text-neutral-300"
            >
              {{ i + 1 }}
            </span>
            <div class="text-[15px]">{{ w.uz }}</div>
            <div
              class="mt-0.5 text-xs italic text-stone-500 dark:text-neutral-400"
            >
              {{ w.tr }}
            </div>
          </div>
          <div
            class="arabic-text col-span-2 mt-2 border-t border-stone-200 pt-2 text-right text-[17px] text-stone-500 dark:border-neutral-700 dark:text-neutral-400"
          >
            {{ w.ex }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
