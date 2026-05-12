<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Screen, MistakeEntry } from '@/types/vocab'
import { useVocab } from '@/composables/useVocab'
import { useStorage } from '@/composables/useStorage'
import { useQuiz } from '@/composables/useQuiz'
import { useSpeech } from '@/composables/useSpeech'

import AppHeader from '@/components/AppHeader.vue'
import UpdateBanner from '@/components/UpdateBanner.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import ErrorScreen from '@/components/ErrorScreen.vue'
import HomeScreen from '@/components/HomeScreen.vue'
import BrowseScreen from '@/components/BrowseScreen.vue'
import BrowseLessonScreen from '@/components/BrowseLessonScreen.vue'
import SetupScreen from '@/components/SetupScreen.vue'
import QuizScreen from '@/components/QuizScreen.vue'
import EndScreen from '@/components/EndScreen.vue'

// === Data layer ===
const {
  lessons,
  allWords,
  isLoading,
  loadError,
  currentVersion,
  updateAvailable,
  newVersionInfo,
  applyUpdate,
} = useVocab()

// === Persistent state ===
const totalCorrect = useStorage<number>('almumtaz_total_correct', 0)
const totalWrong = useStorage<number>('almumtaz_total_wrong', 0)
const mistakes = useStorage<Record<string, MistakeEntry>>(
  'almumtaz_mistakes',
  {},
)

// === Screen routing ===
const screen = ref<Screen>('home')
const browseLessonNum = ref<number | null>(null)

// === Quiz session ===
const quiz = useQuiz({ allWords, mistakes, totalCorrect, totalWrong })

// === Speech ===
const { speak } = useSpeech()

// When lessons load for the first time, default-select all
watch(
  lessons,
  (newLessons) => {
    if (newLessons.length > 0 && quiz.selectedLessons.value.length === 0) {
      quiz.selectedLessons.value = newLessons.map((l) => l.number)
    }
  },
  { immediate: true },
)

// === Navigation handlers ===
function goHome() {
  screen.value = 'home'
  browseLessonNum.value = null
}

function startQuizFlow() {
  quiz.useMistakes.value = false
  screen.value = 'setup'
}

function startMistakesPractice() {
  if (Object.keys(mistakes.value).length === 0) {
    alert("Hozircha xato qilingan so'zlar yo'q.")
    return
  }
  const ok = quiz.startSession({ mistakesMode: true })
  if (ok) screen.value = 'quiz'
}

function startQuizFromSetup() {
  const ok = quiz.startSession()
  if (!ok) {
    alert('Iltimos, kamida bitta dars tanlang.')
    return
  }
  screen.value = 'quiz'
}

function goToBrowse() {
  screen.value = 'browse'
}

function openBrowseLesson(n: number) {
  browseLessonNum.value = n
  screen.value = 'browse-lesson'
}

function backFromQuiz() {
  if (
    quiz.questions.value.length > 0 &&
    quiz.currentIdx.value < quiz.questions.value.length - 1
  ) {
    if (!confirm("Quizni to'xtatib, asosiy ekranga qaytasizmi?")) return
  }
  goHome()
}

function advanceQuestion() {
  quiz.advance(() => {
    screen.value = 'end'
  })
}

function restartSession() {
  quiz.startSession({ mistakesMode: quiz.useMistakes.value })
  screen.value = 'quiz'
}

function resetStats() {
  if (
    confirm(
      "Umumiy statistikani tozalashni xohlaysizmi? Xato ro'yxati ham tozalanadi.",
    )
  ) {
    totalCorrect.value = 0
    totalWrong.value = 0
    mistakes.value = {}
  }
}

function clearMistakes() {
  if (confirm("Xato ro'yxatini tozalashni xohlaysizmi?")) {
    mistakes.value = {}
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-[600px] flex-col p-4">
    <AppHeader
      :current-version="currentVersion"
      :total-correct="totalCorrect"
      :total-wrong="totalWrong"
      :show-stats="!isLoading && !loadError"
    />

    <UpdateBanner
      v-if="updateAvailable && newVersionInfo && !isLoading"
      :version-info="newVersionInfo"
      @apply="applyUpdate"
    />

    <LoadingScreen v-if="isLoading && lessons.length === 0" />

    <ErrorScreen
      v-else-if="loadError && lessons.length === 0"
      :error="loadError"
    />

    <HomeScreen
      v-else-if="screen === 'home'"
      :mistakes="mistakes"
      @start-quiz="startQuizFlow"
      @browse="goToBrowse"
      @practice-mistakes="startMistakesPractice"
      @clear-mistakes="clearMistakes"
      @reset-stats="resetStats"
    />

    <BrowseScreen
      v-else-if="screen === 'browse'"
      :lessons="lessons"
      @back="goHome"
      @open="openBrowseLesson"
    />

    <BrowseLessonScreen
      v-else-if="screen === 'browse-lesson' && browseLessonNum !== null"
      :lesson="lessons.find((l) => l.number === browseLessonNum)!"
      @back="screen = 'browse'"
      @speak="speak"
    />

    <SetupScreen
      v-else-if="screen === 'setup'"
      :lessons="lessons"
      :total-words="allWords.length"
      :mode="quiz.mode.value"
      :direction="quiz.direction.value"
      :selected-lessons="quiz.selectedLessons.value"
      :count="quiz.count.value"
      @update:mode="quiz.mode.value = $event"
      @update:direction="quiz.direction.value = $event"
      @update:count="quiz.count.value = $event"
      @toggle-lesson="(n) => quiz.toggleLesson(lessons.map((l) => l.number), n)"
      @back="goHome"
      @start="startQuizFromSetup"
    />

    <QuizScreen
      v-else-if="screen === 'quiz' && quiz.currentQuestion.value"
      :question="quiz.currentQuestion.value"
      :current-idx="quiz.currentIdx.value"
      :total="quiz.questions.value.length"
      :progress="quiz.progressPct.value"
      :use-mistakes="quiz.useMistakes.value"
      :flipped="quiz.flipped.value"
      :no-flip-transition="quiz.noFlipTransition.value"
      :feedback="quiz.feedback.value"
      :choice-answered="quiz.choiceAnswered.value"
      @flip="quiz.flipCard"
      @rate="(known) => quiz.rateCard(known, advanceQuestion)"
      @select-choice="quiz.selectChoice"
      @next="advanceQuestion"
      @back="backFromQuiz"
      @speak="speak"
    />

    <EndScreen
      v-else-if="screen === 'end'"
      :session-correct="quiz.sessionCorrect.value"
      :session-wrong="quiz.sessionWrong.value"
      :total="quiz.questions.value.length"
      :use-mistakes="quiz.useMistakes.value"
      :mistakes-count="Object.keys(mistakes).length"
      @restart="restartSession"
      @home="goHome"
      @practice-mistakes="startMistakesPractice"
    />
  </div>
</template>
