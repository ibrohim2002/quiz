<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { Screen, MistakeEntry, Book } from '@/types/vocab';
import { useVocab } from '@/composables/useVocab';
import { useStorage } from '@/composables/useStorage';
import { useQuiz } from '@/composables/useQuiz';
import { useSpeech } from '@/composables/useSpeech';
import { useHistoryRouter } from '@/composables/useHistoryRouter';

import AppHeader from '@/components/AppHeader.vue';
import UpdateBanner from '@/components/UpdateBanner.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import ErrorScreen from '@/components/ErrorScreen.vue';
import BooksScreen from '@/components/BooksScreen.vue';
import HomeScreen from '@/components/HomeScreen.vue';
import BrowseScreen from '@/components/BrowseScreen.vue';
import BrowseLessonScreen from '@/components/BrowseLessonScreen.vue';
import BrowseTextDialogScreen from '@/components/BrowseTextDialogScreen.vue';
import BrowseGrammarScreen from '@/components/BrowseGrammarScreen.vue';
import SetupScreen from '@/components/SetupScreen.vue';
import QuizScreen from '@/components/QuizScreen.vue';
import EndScreen from '@/components/EndScreen.vue';

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
} = useVocab();

// === Kitoblar ro'yxati ===
const books = ref<Book[]>([]);
const booksLoading = ref(true);
const selectedBookId = ref<string | null>(null);

const selectedBook = computed(
	() => books.value.find(b => b.id === selectedBookId.value) ?? null,
);

onMounted(async () => {
	try {
		const res = await fetch('/books.json');
		books.value = await res.json();
	} catch (err) {
		console.error('Failed to load books:', err);
	} finally {
		booksLoading.value = false;
	}
});

// === Persistent state ===
const totalCorrect = useStorage<number>('almumtaz_total_correct', 0);
const totalWrong = useStorage<number>('almumtaz_total_wrong', 0);
const mistakes = useStorage<Record<string, MistakeEntry>>(
	'almumtaz_mistakes',
	{},
);

// === History-aware routing — boshlang'ich 'books' ===
const router = useHistoryRouter('books');
const screen = computed<Screen>(() => router.current.value.screen);
const routeParams = computed(() => router.current.value.params ?? {});

const browseLessonNum = computed<number | null>(
	() => (routeParams.value.lessonNum as number) ?? null,
);
const browseLessonMode = computed<'all' | 'textdialog' | 'grammar' | 'words'>(
	() => (routeParams.value.mode as any) ?? 'all',
);

// === Quiz session ===
const quiz = useQuiz({ allWords, mistakes, totalCorrect, totalWrong });

// === Speech ===
const { speak, stop: stopSpeech, speaking } = useSpeech();

watch(
	lessons,
	newLessons => {
		if (newLessons.length > 0 && quiz.selectedLessons.value.length === 0) {
			quiz.selectedLessons.value = newLessons
				.filter(l => !l.comingSoon)
				.map(l => l.number);
		}
	},
	{ immediate: true },
);

// === Navigation handlers ===
function openBook(bookId: string) {
	selectedBookId.value = bookId;
	router.navigate('home');
}

function backToBooks() {
	router.navigate('books');
}

function goHome() {
	router.navigate('home');
}

function startQuizFlow() {
	quiz.useMistakes.value = false;
	router.navigate('setup');
}

function startMistakesPractice() {
	if (Object.keys(mistakes.value).length === 0) {
		alert("Hozircha xato qilingan so'zlar yo'q.");
		return;
	}
	const ok = quiz.startSession({ mistakesMode: true });
	if (ok) router.navigate('quiz');
}

function startQuizFromSetup() {
	const ok = quiz.startSession();
	if (!ok) {
		alert('Iltimos, kamida bitta dars tanlang.');
		return;
	}
	router.navigate('quiz');
}

function goToBrowse() {
	router.navigate('browse');
}

function goToBrowseTextDialog() {
	router.navigate('browse-textdialog');
}

function goToBrowseGrammar() {
	router.navigate('browse-grammar');
}

function openBrowseLesson(
	n: number,
	mode: 'all' | 'textdialog' | 'grammar' | 'words' = 'all',
) {
	router.navigate('browse-lesson', { lessonNum: n, mode });
}

function backFromQuiz() {
	if (
		quiz.questions.value.length > 0 &&
		quiz.currentIdx.value < quiz.questions.value.length - 1
	) {
		if (!confirm("Quizni to'xtatib, asosiy ekranga qaytasizmi?")) return;
	}
	goHome();
}

function advanceQuestion() {
	quiz.advance(() => {
		router.replace('end');
	});
}

function restartSession() {
	quiz.startSession({ mistakesMode: quiz.useMistakes.value });
	router.replace('quiz');
}

function resetStats() {
	if (
		confirm(
			"Umumiy statistikani tozalashni xohlaysizmi? Xato ro'yxati ham tozalanadi.",
		)
	) {
		totalCorrect.value = 0;
		totalWrong.value = 0;
		mistakes.value = {};
	}
}

function clearMistakes() {
	if (confirm("Xato ro'yxatini tozalashni xohlaysizmi?")) {
		mistakes.value = {};
	}
}
</script>

<template>
	<div class="mx-auto flex min-h-screen max-w-[600px] flex-col p-4">
		<AppHeader
			:current-version="currentVersion"
			:total-correct="totalCorrect"
			:total-wrong="totalWrong"
			:show-stats="!isLoading && !loadError && screen !== 'books'"
		/>

		<UpdateBanner
			v-if="updateAvailable && newVersionInfo && !isLoading"
			:version-info="newVersionInfo"
			@apply="applyUpdate"
		/>

		<!-- Books screen — kitoblar ro'yxati (asosiy) -->
		<BooksScreen v-if="screen === 'books'" :books="books" @open="openBook" />

		<LoadingScreen v-else-if="isLoading && lessons.length === 0" />

		<ErrorScreen
			v-else-if="loadError && lessons.length === 0"
			:error="loadError"
		/>

		<HomeScreen
			v-else-if="screen === 'home'"
			:mistakes="mistakes"
			:book-title="selectedBook?.titleUz"
			@back-to-books="backToBooks"
			@start-quiz="startQuizFlow"
			@browse="goToBrowse"
			@browse-text-dialog="goToBrowseTextDialog"
			@browse-grammar="goToBrowseGrammar"
			@practice-mistakes="startMistakesPractice"
			@clear-mistakes="clearMistakes"
			@reset-stats="resetStats"
		/>

		<BrowseScreen
			v-else-if="screen === 'browse'"
			:lessons="lessons"
			@back="router.back()"
			@open="n => openBrowseLesson(n, 'words')"
		/>

		<BrowseTextDialogScreen
			v-else-if="screen === 'browse-textdialog'"
			:lessons="lessons"
			@back="router.back()"
			@open="n => openBrowseLesson(n, 'textdialog')"
		/>

		<BrowseGrammarScreen
			v-else-if="screen === 'browse-grammar'"
			:lessons="lessons"
			@back="router.back()"
			@open="n => openBrowseLesson(n, 'grammar')"
		/>

		<BrowseLessonScreen
			v-else-if="screen === 'browse-lesson' && browseLessonNum !== null"
			:lesson="lessons.find(l => l.number === browseLessonNum)!"
			:mode="browseLessonMode"
			:speak="speak"
			:stop-speak="stopSpeech"
			:speaking="speaking"
			@back="router.back()"
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
			@toggle-lesson="
				n =>
					quiz.toggleLesson(
						lessons.map(l => l.number),
						n,
					)
			"
			@back="router.back()"
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
			@rate="known => quiz.rateCard(known, advanceQuestion)"
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
