<script setup lang="ts">
import type { Lesson, QuizMode, Direction } from '@/types/vocab'

defineProps<{
  lessons: Lesson[]
  totalWords: number
  mode: QuizMode
  direction: Direction
  selectedLessons: number[]
  count: number | 'all'
}>()

defineEmits<{
  'update:mode': [m: QuizMode]
  'update:direction': [d: Direction]
  'update:count': [c: number | 'all']
  toggleLesson: [n: number | 'all']
  back: []
  start: []
}>()

const modeOptions: { value: QuizMode; label: string; meta: string }[] = [
  { value: 'mixed', label: 'Aralash (Flashcard + Test)', meta: 'Tavsiya etiladi' },
  { value: 'flashcard', label: 'Faqat Flashcard', meta: "O'zingizni baholaysiz" },
  { value: 'quiz', label: 'Faqat Test (4 variant)', meta: 'Avtomatik tekshirish' },
]

const directionOptions: { value: Direction; label: string }[] = [
  { value: 'auto', label: 'Aralash (avtomatik)' },
  { value: 'ar2uz', label: "Arabcha → O'zbekcha" },
  { value: 'uz2ar', label: "O'zbekcha → Arabcha" },
]

const countOptions: { value: number | 'all'; label: string }[] = [
  { value: 10, label: '10 ta' },
  { value: 20, label: '20 ta' },
  { value: 50, label: '50 ta' },
  { value: 'all', label: 'Hammasi' },
]
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

    <!-- Rejim -->
    <section
      class="mb-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
    >
      <h2
        class="mb-2.5 text-[14px] font-medium uppercase tracking-wider text-stone-500 dark:text-neutral-400"
      >
        Rejim
      </h2>
      <div class="flex flex-col gap-2">
        <button
          v-for="opt in modeOptions"
          :key="opt.value"
          class="flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-3 text-[15px] transition-transform active:scale-[0.98]"
          :class="
            mode === opt.value
              ? 'border-brand-500 bg-brand-50 font-medium text-brand-600 dark:bg-brand-700/30 dark:text-brand-400'
              : 'border-stone-200 bg-white text-stone-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100'
          "
          @click="$emit('update:mode', opt.value)"
        >
          <span>{{ opt.label }}</span>
          <span
            class="text-xs"
            :class="
              mode === opt.value
                ? 'text-brand-500'
                : 'text-stone-500 dark:text-neutral-400'
            "
          >
            {{ opt.meta }}
          </span>
        </button>
      </div>
    </section>

    <!-- Darslar -->
    <section
      class="mb-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
    >
      <h2
        class="mb-2.5 text-[14px] font-medium uppercase tracking-wider text-stone-500 dark:text-neutral-400"
      >
        Darslar
      </h2>
      <div class="flex flex-col gap-2">
        <button
          class="flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-3 text-[15px] transition-transform active:scale-[0.98]"
          :class="
            selectedLessons.length === lessons.length
              ? 'border-brand-500 bg-brand-50 font-medium text-brand-600 dark:bg-brand-700/30 dark:text-brand-400'
              : 'border-stone-200 bg-white text-stone-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100'
          "
          @click="$emit('toggleLesson', 'all')"
        >
          <span><strong>Barcha darslar</strong></span>
          <span
            class="text-xs"
            :class="
              selectedLessons.length === lessons.length
                ? 'text-brand-500'
                : 'text-stone-500 dark:text-neutral-400'
            "
          >
            {{ totalWords }} ta so'z
          </span>
        </button>
        <button
          v-for="lesson in lessons"
          :key="lesson.number"
          class="flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-3 text-[15px] transition-transform active:scale-[0.98]"
          :class="
            selectedLessons.includes(lesson.number)
              ? 'border-brand-500 bg-brand-50 font-medium text-brand-600 dark:bg-brand-700/30 dark:text-brand-400'
              : 'border-stone-200 bg-white text-stone-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100'
          "
          @click="$emit('toggleLesson', lesson.number)"
        >
          <span>Dars {{ lesson.number }}: {{ lesson.titleUz }}</span>
          <span
            class="text-xs"
            :class="
              selectedLessons.includes(lesson.number)
                ? 'text-brand-500'
                : 'text-stone-500 dark:text-neutral-400'
            "
          >
            {{ lesson.words.length }} ta
          </span>
        </button>
      </div>
    </section>

    <!-- Yo'nalish -->
    <section
      class="mb-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
    >
      <h2
        class="mb-2.5 text-[14px] font-medium uppercase tracking-wider text-stone-500 dark:text-neutral-400"
      >
        Yo'nalish
      </h2>
      <div class="flex flex-col gap-2">
        <button
          v-for="opt in directionOptions"
          :key="opt.value"
          class="flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-3 text-[15px] transition-transform active:scale-[0.98]"
          :class="
            direction === opt.value
              ? 'border-brand-500 bg-brand-50 font-medium text-brand-600 dark:bg-brand-700/30 dark:text-brand-400'
              : 'border-stone-200 bg-white text-stone-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100'
          "
          @click="$emit('update:direction', opt.value)"
        >
          <span>{{ opt.label }}</span>
        </button>
      </div>
    </section>

    <!-- Savollar soni -->
    <section
      class="mb-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
    >
      <h2
        class="mb-2.5 text-[14px] font-medium uppercase tracking-wider text-stone-500 dark:text-neutral-400"
      >
        Savollar soni
      </h2>
      <div class="flex flex-col gap-2">
        <button
          v-for="opt in countOptions"
          :key="String(opt.value)"
          class="flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-3 text-[15px] transition-transform active:scale-[0.98]"
          :class="
            count === opt.value
              ? 'border-brand-500 bg-brand-50 font-medium text-brand-600 dark:bg-brand-700/30 dark:text-brand-400'
              : 'border-stone-200 bg-white text-stone-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100'
          "
          @click="$emit('update:count', opt.value)"
        >
          <span>{{ opt.label }}</span>
        </button>
      </div>
    </section>

    <button
      class="w-full cursor-pointer rounded-xl border-0 bg-brand-500 px-5 py-3.5 text-base font-medium text-white active:scale-[0.98] active:bg-brand-600"
      @click="$emit('start')"
    >
      Boshlash
    </button>
  </div>
</template>
