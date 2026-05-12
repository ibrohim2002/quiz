import { ref, computed, type Ref } from 'vue'
import type {
  WordWithMeta,
  Question,
  QuizMode,
  Direction,
  Feedback,
  MistakeEntry,
  QuestionMode,
  ResolvedDirection,
} from '@/types/vocab'

/** Fisher-Yates shuffle, returns new array */
function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

interface UseQuizOptions {
  allWords: Ref<WordWithMeta[]>
  mistakes: Ref<Record<string, MistakeEntry>>
  totalCorrect: Ref<number>
  totalWrong: Ref<number>
}

export function useQuiz({
  allWords,
  mistakes,
  totalCorrect,
  totalWrong,
}: UseQuizOptions) {
  // Settings
  const mode = ref<QuizMode>('mixed')
  const direction = ref<Direction>('auto')
  const selectedLessons = ref<number[]>([])
  const count = ref<number | 'all'>(20)
  const useMistakes = ref(false)

  // Session state
  const questions = ref<Question[]>([])
  const currentIdx = ref(0)
  const sessionCorrect = ref(0)
  const sessionWrong = ref(0)
  const flipped = ref(false)
  const noFlipTransition = ref(false)
  const awaitingNext = ref(false)
  const feedback = ref<Feedback | null>(null)
  const choiceAnswered = ref<number | null>(null)

  // Computed
  const currentQuestion = computed<Question | null>(
    () => questions.value[currentIdx.value] ?? null,
  )
  const progressPct = computed(() =>
    questions.value.length === 0
      ? 0
      : (currentIdx.value / questions.value.length) * 100,
  )
  const isFinished = computed(
    () =>
      questions.value.length > 0 &&
      currentIdx.value >= questions.value.length - 1 &&
      awaitingNext.value,
  )

  // Helpers
  const buildQuestion = (word: WordWithMeta): Question => {
    const dir: ResolvedDirection =
      direction.value === 'auto'
        ? Math.random() < 0.5
          ? 'ar2uz'
          : 'uz2ar'
        : direction.value
    const qm: QuestionMode =
      mode.value === 'mixed'
        ? Math.random() < 0.5
          ? 'flashcard'
          : 'quiz'
        : mode.value

    if (qm === 'quiz') {
      const others = allWords.value.filter((w) => w.id !== word.id)
      const distractors = shuffle(others).slice(0, 3)
      return {
        word,
        mode: qm,
        direction: dir,
        choices: shuffle([word, ...distractors]),
      }
    }

    return { word, mode: qm, direction: dir }
  }

  const buildQuestions = (): Question[] => {
    const pool: WordWithMeta[] = useMistakes.value
      ? Object.values(mistakes.value).map((m) => m.word)
      : allWords.value.filter((w) => selectedLessons.value.includes(w.lesson))

    if (pool.length === 0) return []

    const shuffled = shuffle(pool)
    const target =
      count.value === 'all' ? shuffled.length : Math.min(count.value, shuffled.length)
    return shuffled.slice(0, target).map(buildQuestion)
  }

  // Mistake tracking
  const recordMistake = (word: WordWithMeta) => {
    const existing = mistakes.value[word.id]
    mistakes.value = {
      ...mistakes.value,
      [word.id]: {
        count: (existing?.count ?? 0) + 1,
        word: { ...word },
      },
    }
  }

  const removeMistake = (word: WordWithMeta) => {
    if (!mistakes.value[word.id]) return
    const next = { ...mistakes.value }
    delete next[word.id]
    mistakes.value = next
  }

  // Animation-safe flip reset (front face without flicker)
  const resetFlipSilently = (callback: () => void) => {
    noFlipTransition.value = true
    flipped.value = false
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        noFlipTransition.value = false
        callback()
      })
    })
  }

  // Public actions
  const startSession = (opts: { mistakesMode?: boolean } = {}): boolean => {
    useMistakes.value = opts.mistakesMode ?? false
    if (useMistakes.value && Object.keys(mistakes.value).length === 0) {
      return false
    }
    if (!useMistakes.value && selectedLessons.value.length === 0) {
      return false
    }
    noFlipTransition.value = true
    flipped.value = false
    questions.value = buildQuestions()
    currentIdx.value = 0
    sessionCorrect.value = 0
    sessionWrong.value = 0
    feedback.value = null
    choiceAnswered.value = null
    awaitingNext.value = false
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        noFlipTransition.value = false
      })
    })
    return true
  }

  const flipCard = () => {
    if (!flipped.value) flipped.value = true
  }

  const rateCard = (known: boolean, onComplete: () => void) => {
    if (awaitingNext.value) return
    awaitingNext.value = true
    const word = currentQuestion.value?.word
    if (!word) return
    if (known) {
      sessionCorrect.value++
      totalCorrect.value++
      if (useMistakes.value) removeMistake(word)
    } else {
      sessionWrong.value++
      totalWrong.value++
      recordMistake(word)
    }
    setTimeout(onComplete, 250)
  }

  const selectChoice = (idx: number) => {
    if (awaitingNext.value) return
    awaitingNext.value = true
    choiceAnswered.value = idx
    const q = currentQuestion.value
    if (!q || !q.choices) return
    const chosen = q.choices[idx]
    if (!chosen) return
    const correct = chosen.id === q.word.id

    if (correct) {
      sessionCorrect.value++
      totalCorrect.value++
      feedback.value = { type: 'correct', message: "To'g'ri! ✓" }
      if (useMistakes.value) removeMistake(q.word)
    } else {
      sessionWrong.value++
      totalWrong.value++
      recordMistake(q.word)
      feedback.value = {
        type: 'wrong',
        message: `Noto'g'ri. To'g'ri javob: ${q.word.ar} = ${q.word.uz}`,
      }
    }
  }

  const advance = (onFinish: () => void) => {
    if (currentIdx.value >= questions.value.length - 1) {
      onFinish()
      return
    }
    resetFlipSilently(() => {
      currentIdx.value++
      feedback.value = null
      choiceAnswered.value = null
      awaitingNext.value = false
    })
  }

  const toggleLesson = (lessonNumbers: readonly number[], n: number | 'all') => {
    if (n === 'all') {
      selectedLessons.value =
        selectedLessons.value.length === lessonNumbers.length ? [] : [...lessonNumbers]
    } else if (selectedLessons.value.includes(n)) {
      selectedLessons.value = selectedLessons.value.filter((x) => x !== n)
    } else {
      selectedLessons.value = [...selectedLessons.value, n]
    }
  }

  return {
    // settings
    mode,
    direction,
    selectedLessons,
    count,
    useMistakes,
    // session state
    questions,
    currentIdx,
    sessionCorrect,
    sessionWrong,
    flipped,
    noFlipTransition,
    awaitingNext,
    feedback,
    choiceAnswered,
    currentQuestion,
    progressPct,
    isFinished,
    // actions
    startSession,
    flipCard,
    rateCard,
    selectChoice,
    advance,
    toggleLesson,
  }
}
