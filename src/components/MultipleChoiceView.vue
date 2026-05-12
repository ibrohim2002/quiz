<script setup lang="ts">
import type { Question, Feedback } from '@/types/vocab'

defineProps<{
  question: Question
  feedback: Feedback | null
  choiceAnswered: number | null
}>()

defineEmits<{
  selectChoice: [idx: number]
  next: []
  speak: [text: string]
}>()
</script>

<template>
  <div>
    <div
      class="mb-4 flex min-h-[240px] flex-1 flex-col justify-center rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
    >
      <template v-if="question.direction === 'ar2uz'">
        <div
          class="mb-3 text-center text-xs uppercase tracking-wider text-stone-500 dark:text-neutral-400"
        >
          Bu so'zning tarjimasi nima?
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
          Bu so'zning arabchasi qaysi?
        </div>
        <div class="px-1 py-2 text-center text-[24px] font-medium leading-[1.4]">
          {{ question.word.uz }}
        </div>
      </template>
    </div>

    <div class="grid gap-2.5">
      <button
        v-for="(c, i) in question.choices"
        :key="i"
        class="w-full cursor-pointer rounded-xl border px-4 py-3.5 text-left transition-transform active:scale-[0.98] disabled:cursor-default"
        :class="[
          question.direction === 'uz2ar'
            ? 'arabic-text text-right text-[26px]'
            : 'text-[17px]',
          choiceAnswered !== null && c.id === question.word.id
            ? 'border-green-600 bg-green-50 font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300'
            : choiceAnswered === i && c.id !== question.word.id
              ? 'border-red-600 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              : 'border-stone-200 bg-white text-stone-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100',
        ]"
        :disabled="choiceAnswered !== null"
        @click="$emit('selectChoice', i)"
      >
        {{ question.direction === 'uz2ar' ? c.ar : c.uz }}
      </button>
    </div>

    <div
      v-if="feedback"
      class="mt-3 rounded-xl p-3.5 text-center font-medium"
      :class="
        feedback.type === 'correct'
          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
          : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      "
    >
      {{ feedback.message }}
    </div>

    <button
      v-if="feedback"
      class="mt-3 w-full cursor-pointer rounded-xl border-0 bg-brand-500 px-5 py-3.5 text-base font-medium text-white active:scale-[0.98] active:bg-brand-600"
      @click="$emit('next')"
    >
      Keyingisi
    </button>
  </div>
</template>
