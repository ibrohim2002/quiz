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
	texts?: LessonText[]; // YANGI
	grammar?: GrammarNote[];
	comprehensionQuiz?: ComprehensionQuestion[]; // YANGI
	comingSoon?: boolean; // YANGI: dars hali qo'shilmagan
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
	| 'browse' // lug'at darslar ro'yxati
	| 'browse-lesson' // dars ichidagi tablar
	| 'browse-textdialog' // YANGI: matn/dialog darslar ro'yxati
	| 'browse-grammar' // YANGI: qoidalar darslar ro'yxati
	| 'setup'
	| 'quiz'
	| 'end';
