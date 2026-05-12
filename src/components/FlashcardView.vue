<script setup lang="ts">
import type { Question } from '@/types/vocab'

defineProps<{
  question: Question
  flipped: boolean
  noTransition: boolean
}>()

defineEmits<{
  flip: []
  rate: [known: boolean]
  speak: [text: string]
}>()
</script>

<template>
  <div class="flex flex-1 flex-col [perspective:1000px]">
    <div
      class="flashcard relative min-h-[280px] flex-1 cursor-pointer"
      :class="{ flipped, 'no-transition': noTransition }"
      @click="$emit('flip')"
    >
      <!-- Front -->
      <div
        class="flashcard-face absolute flex h-full w-full flex-col justify-center rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
      >
        <template v-if="question.direction === 'ar2uz'">
          <div
            class="mb-3 text-center text-xs uppercase tracking-wider text-stone-500 dark:text-neutral-400"
          >
            Arabcha so'z
          </div>
          <div class="arabic-text text-center text-[48px] leading-[1.6]">
            {{ question.word.ar }}
          </div>
          <button
            class="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-transparent p-2 text-[13px] text-stone-500 active:bg-stone-100 dark:border-neutral-700 dark:text-neutral-400 dark:active:bg-neutral-700"
            @click.stop="$emit('speak', question.word.ar)"
          >
            🔊 Eshitish
          </button>
        </template>
        <template v-else>
          <div
            class="mb-3 text-center text-xs uppercase tracking-wider text-stone-500 dark:text-neutral-400"
          >
            O'zbekcha
          </div>
          <div class="px-1 py-2 text-center text-[24px] font-medium leading-[1.4]">
            {{ question.word.uz }}
          </div>
        </template>
      </div>

      <!-- Back -->
      <div
        class="flashcard-face flashcard-back absolute flex h-full w-full flex-col justify-center rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
      >
        <template v-if="question.direction === 'ar2uz'">
          <div
            class="mb-3 text-center text-xs uppercase tracking-wider text-stone-500 dark:text-neutral-400"
          >
            Tarjima
          </div>
          <div class="px-1 py-2 text-center text-[24px] font-medium leading-[1.4]">
            {{ question.word.uz }}
          </div>
          <div
            class="mt-2 text-center text-base italic text-stone-500 dark:text-neutral-400"
          >
            {{ question.word.tr }}
          </div>
          <div
            class="mt-4 border-t border-stone-200 pt-4 text-center dark:border-neutral-700"
          >
            <div
              class="mb-1.5 text-[11px] uppercase tracking-wider text-stone-500 dark:text-neutral-400"
            >
              Misol
            </div>
            <div class="arabic-text text-center text-2xl text-stone-500 dark:text-neutral-400">
              {{ question.word.ex }}
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="mb-3 text-center text-xs uppercase tracking-wider text-stone-500 dark:text-neutral-400"
          >
            Arabcha
          </div>
          <div class="arabic-text text-center text-[48px] leading-[1.6]">
            {{ question.word.ar }}
          </div>
          <div
            class="mt-2 text-center text-base italic text-stone-500 dark:text-neutral-400"
          >
            {{ question.word.tr }}
          </div>
          <button
            class="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-transparent p-2 text-[13px] text-stone-500 active:bg-stone-100 dark:border-neutral-700 dark:text-neutral-400 dark:active:bg-neutral-700"
            @click.stop="$emit('speak', question.word.ar)"
          >
            🔊 Eshitish
          </button>
          <div
            class="mt-4 border-t border-stone-200 pt-4 text-center dark:border-neutral-700"
          >
            <div
              class="mb-1.5 text-[11px] uppercase tracking-wider text-stone-500 dark:text-neutral-400"
            >
              Misol
            </div>
            <div class="arabic-text text-center text-2xl text-stone-500 dark:text-neutral-400">
              {{ question.word.ex }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <div
      v-if="!flipped"
      class="mt-4 text-center text-xs text-stone-500 dark:text-neutral-400"
    >
      Javobni ko'rish uchun bosing
    </div>
    <div v-else class="mt-3">
      <div class="grid grid-cols-2 gap-2">
        <button
          class="cursor-pointer rounded-xl border border-red-600 bg-red-50 p-3 text-[15px] font-medium text-red-700 transition-transform active:scale-[0.97] dark:bg-red-900/30 dark:text-red-300"
          @click="$emit('rate', false)"
        >
          Bilmadim
        </button>
        <button
          class="cursor-pointer rounded-xl border border-green-600 bg-green-50 p-3 text-[15px] font-medium text-green-700 transition-transform active:scale-[0.97] dark:bg-green-900/30 dark:text-green-300"
          @click="$emit('rate', true)"
        >
          Bildim
        </button>
      </div>
    </div>
  </div>
</template>
