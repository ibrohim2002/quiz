export interface Word {
  ar: string
  tr: string
  uz: string
  ex: string
}

export interface Lesson {
  number: number
  titleAr: string
  titleUz: string
  words: Word[]
}

/** Word with lesson metadata, used after flattening */
export interface WordWithMeta extends Word {
  lesson: number
  lessonTitle: string
  id: string
}

export interface VersionInfo {
  version: string
  releaseDate: string
  totalWords: number
  totalLessons: number
  changelog: string
}

export type QuizMode = 'mixed' | 'flashcard' | 'quiz'
export type Direction = 'auto' | 'ar2uz' | 'uz2ar'
export type QuestionMode = 'flashcard' | 'quiz'
export type ResolvedDirection = 'ar2uz' | 'uz2ar'

export interface Question {
  word: WordWithMeta
  mode: QuestionMode
  direction: ResolvedDirection
  choices?: WordWithMeta[]
}

export interface MistakeEntry {
  count: number
  word: WordWithMeta
}

export interface QuizStorage {
  totalCorrect: number
  totalWrong: number
  mistakes: Record<string, MistakeEntry>
}

export interface Feedback {
  type: 'correct' | 'wrong'
  message: string
}

export type Screen =
  | 'home'
  | 'browse'
  | 'browse-lesson'
  | 'setup'
  | 'quiz'
  | 'end'
