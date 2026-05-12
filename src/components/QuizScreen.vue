<script setup lang="ts">
import type { Question, Feedback } from '@/types/vocab'
import FlashcardView from './FlashcardView.vue'
import MultipleChoiceView from './MultipleChoiceView.vue'

defineProps<{
  question: Question
  currentIdx: number
  total: number
  progress: number
  useMistakes: boolean
  flipped: boolean
  noFlipTransition: boolean
  feedback: Feedback | null
  choiceAnswered: number | null
}>()

defineEmits<{
  flip: []
  rate: [known: boolean]
  selectChoice: [idx: number]
  next: []
  back: []
  speak: [text: string]
}>()
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="mb-3 flex items-center gap-2">
      <button
        class="cursor-pointer rounded-lg border border-stone-200 bg-transparent px-3 py-2 text-[13px] text-stone-900 dark:border-neutral-700 dark:text-neutral-100"
        @click="$emit('back')"
      >
        ‹ Chiqish
      </button>
      <span
        v-if="useMistakes"
        class="text-[13px] font-semibold text-amber-600 dark:text-amber-400"
      >
        ⚠️ Xatolar ustida ishlash
      </span>
      <span class="ml-auto text-[13px] text-stone-500 dark:text-neutral-400">
        {{ currentIdx + 1 }} / {{ total }}
      </span>
    </div>

    <div
      class="mb-4 h-1 overflow-hidden rounded-sm bg-stone-200 dark:bg-neutral-800"
    >
      <div
        class="h-full rounded-sm bg-brand-500 transition-[width] duration-300"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <div
      class="mb-2 inline-block text-xs text-stone-500 dark:text-neutral-400"
    >
      Dars {{ question.word.lesson }}: {{ question.word.lessonTitle }}
    </div>

    <FlashcardView
      v-if="question.mode === 'flashcard'"
      :question="question"
      :flipped="flipped"
      :no-transition="noFlipTransition"
      @flip="$emit('flip')"
      @rate="(known) => $emit('rate', known)"
      @speak="(text) => $emit('speak', text)"
    />

    <MultipleChoiceView
      v-else
      :question="question"
      :feedback="feedback"
      :choice-answered="choiceAnswered"
      @select-choice="(idx) => $emit('selectChoice', idx)"
      @next="$emit('next')"
      @speak="(text) => $emit('speak', text)"
    />
  </div>
</template>
