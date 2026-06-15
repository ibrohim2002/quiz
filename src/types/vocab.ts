// src/types/vocab.ts

export interface Word {
	ar: string;
	tr: string;
	uz: string;
	ex?: string;
}

export interface DialogueLine {
	speaker: string;
	ar: string;
	uz: string;
}

export interface Dialogue {
	title: string;
	titleUz?: string;
	intro?: string;
	introUz?: string;
	audioUrl?: string;
	lines: DialogueLine[];
}

export interface GrammarExample {
	ar: string;
	uz: string;
}

export interface GrammarNote {
	title: string;
	content: string;
	examples: GrammarExample[];
}

// === YANGI: Matn (kitobdagi nasr matnlari uchun) ===
export interface LessonText {
	title: string; // Arabcha sarlavha (mas: "فِي الْفَصْلِ")
	titleUz?: string; // O'zbekcha sarlavha (mas: "Sinfda")
	ar: string; // To'liq arabcha matn (paragraf yoki bir nechta)
	uz: string; // O'zbekcha tarjima
}

// === YANGI: Matnni tushunish bo'yicha savollar ===
export interface ComprehensionQuestion {
	ar: string; // Savol (arabcha)
	uz: string; // Savol tarjimasi
	answer: {
		// To'g'ri javob
		ar: string;
		uz: string;
	};
	choices?: string[]; // Multiple choice uchun yolg'on variantlar (arabcha).
	// Agar yo'q bo'lsa — ochiq savol sifatida ishlatiladi.
}

export interface Lesson {
	number: number;
	titleAr: string;
	titleUz: string;
	words: Word[];
	dialogues?: Dialogue[];
	texts?: LessonText[];
	grammar?: GrammarNote[];
	comprehensionQuiz?: ComprehensionQuestion[];
	exercises?: ExerciseSection[];
	comingSoon?: boolean;
}

// === Exercises ===
export interface ExerciseMultipleChoice {
	type: 'multiple-choice';
	ar: string;
	uz?: string;
	choices: string[];
	answer: string;
}

export interface ExerciseFillBlank {
	type: 'fill-blank';
	ar: string;
	uz?: string;
	wordBank?: string[];
	answer: string;
}

export interface ExerciseTrueFalse {
	type: 'true-false';
	ar: string;
	uz?: string;
	isTrue: boolean;
}

export interface ExerciseWriting {
	type: 'writing';
	ar: string;
	uz?: string;
}

export interface ExerciseMatching {
	type: 'matching';
	ar: string;
	uz?: string;
	pairs: Array<{ left: string; right: string }>;
}

export type ExerciseItem =
	| ExerciseMultipleChoice
	| ExerciseFillBlank
	| ExerciseTrueFalse
	| ExerciseWriting
	| ExerciseMatching;

export interface ExerciseSection {
	titleAr: string;
	titleUz?: string;
	audioRequired?: boolean;
	audioUrl?: string;
	items: ExerciseItem[];
}

// === Book ===
export interface Book {
  id: string;
  titleAr: string;
  titleUz: string;
  coverImage: string;
  level: string;
  lessonsCount: number;
  description: string;
  available: boolean;
  lessonsFile: string;
  versionFile: string;
}

// === Version / update banner ===
export interface VersionInfo {
  version: string;
  changelog: string;
}

// === Quiz types ===
export interface WordWithMeta extends Word {
  id: string;
  lesson: number;
  lessonTitle: string;
}

export type QuizMode = 'flashcard' | 'quiz' | 'mixed';
export type Direction = 'auto' | 'ar2uz' | 'uz2ar';
export type ResolvedDirection = 'ar2uz' | 'uz2ar';
export type QuestionMode = 'flashcard' | 'quiz';

export interface Question {
  word: WordWithMeta;
  mode: QuestionMode;
  direction: ResolvedDirection;
  choices?: WordWithMeta[];
}

export interface Feedback {
  type: 'correct' | 'wrong';
  message: string;
}

export interface MistakeEntry {
  count: number;
  word: WordWithMeta;
}

// === Screen routing tipi ===
export type Screen =
	| 'books'
	| 'home'
	| 'lessons'
	| 'browse'
	| 'browse-lesson'
	| 'browse-textdialog'
	| 'browse-grammar'
	| 'browse-exercises'
	| 'setup'
	| 'quiz'
	| 'end';
