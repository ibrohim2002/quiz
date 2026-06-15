<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Lesson } from '@/types/vocab';
import DialogueView from './DialogueView.vue';
import GrammarView from './GrammarView.vue';
import TextView from './TextView.vue';
import ComprehensionView from './ComprehensionView.vue';
import ExerciseView from './ExerciseView.vue';

type Tab = 'words' | 'dialogues' | 'texts' | 'grammar' | 'quiz' | 'exercises';
type Mode = 'all' | 'textdialog' | 'grammar' | 'words' | 'exercises';

const props = withDefaults(
	defineProps<{
		lesson: Lesson;
		speak: (text: string) => Promise<void> | void;
		stopSpeak: () => void;
		speaking: boolean;
		mode?: Mode;
	}>(),
	{
		mode: 'all',
	},
);

const emit = defineEmits<{
	(e: 'back'): void;
}>();

const tabsForMode: Record<Mode, Tab[]> = {
	all: ['words', 'dialogues', 'texts', 'grammar', 'quiz', 'exercises'],
	textdialog: ['dialogues', 'texts', 'quiz'],
	grammar: ['grammar'],
	words: ['words'],
	exercises: ['exercises'],
};

const availableTabs = computed<
	Array<{ id: Tab; label: string; count: number }>
>(() => {
	const allowedTabs = tabsForMode[props.mode];
	const tabs: Array<{ id: Tab; label: string; count: number }> = [];

	if (allowedTabs.includes('words')) {
		tabs.push({
			id: 'words',
			label: "So'zlar",
			count: props.lesson.words.length,
		});
	}
	if (allowedTabs.includes('dialogues') && props.lesson.dialogues?.length) {
		tabs.push({
			id: 'dialogues',
			label: 'Dialoglar',
			count: props.lesson.dialogues.length,
		});
	}
	if (allowedTabs.includes('texts') && props.lesson.texts?.length) {
		tabs.push({
			id: 'texts',
			label: 'Matn',
			count: props.lesson.texts.length,
		});
	}
	if (allowedTabs.includes('grammar') && props.lesson.grammar?.length) {
		tabs.push({
			id: 'grammar',
			label: 'Grammatika',
			count: props.lesson.grammar.length,
		});
	}
	if (allowedTabs.includes('quiz') && props.lesson.comprehensionQuiz?.length) {
		tabs.push({
			id: 'quiz',
			label: 'Test',
			count: props.lesson.comprehensionQuiz.length,
		});
	}
	if (allowedTabs.includes('exercises') && props.lesson.exercises?.length) {
		tabs.push({
			id: 'exercises',
			label: 'Mashqlar',
			count: props.lesson.exercises.reduce((s, sec) => s + sec.items.length, 0),
		});
	}
	return tabs;
});

function pickInitialTab(): Tab {
	return availableTabs.value[0]?.id ?? 'words';
}

const activeTab = ref<Tab>(pickInitialTab());

function switchTab(id: Tab) {
	if (props.speaking) props.stopSpeak();
	activeTab.value = id;
}

watch(
	() => [props.lesson.number, props.mode],
	() => {
		if (props.speaking) props.stopSpeak();
		activeTab.value = pickInitialTab();
	},
);

const modeTitle = computed(() => {
	switch (props.mode) {
		case 'textdialog':
			return 'Matn va dialoglar';
		case 'grammar':
			return 'Qoidalar';
		case 'words':
			return "Lug'at";
		case 'exercises':
			return 'Mashqlar';
		default:
			return null;
	}
});
</script>

<template>
	<div class="flex flex-col gap-4 py-4">
		<!-- Header -->
		<div class="flex items-center gap-3">
			<button
				class="shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition"
				aria-label="Orqaga"
				@click="emit('back')"
			>
				<svg
					class="w-5 h-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M15 18l-6-6 6-6" />
				</svg>
			</button>
			<div class="flex-1 min-w-0">
				<h2 class="text-lg font-bold text-gray-900 truncate" dir="rtl">
					{{ lesson.titleAr }}
				</h2>
				<p class="text-sm text-gray-500 truncate">
					{{ lesson.number }}-dars · {{ lesson.titleUz }}
					<span v-if="modeTitle" class="text-gray-400">· {{ modeTitle }}</span>
				</p>
			</div>
		</div>

		<!-- Tab selektori -->
		<div
			v-if="availableTabs.length > 1"
			class="flex gap-1 p-1 bg-gray-100 rounded-lg overflow-x-auto"
		>
			<button
				v-for="tab in availableTabs"
				:key="tab.id"
				:class="[
					'flex-1 min-w-fit px-3 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1.5 whitespace-nowrap',
					activeTab === tab.id
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-600 hover:text-gray-900',
				]"
				@click="switchTab(tab.id)"
			>
				{{ tab.label }}
				<span
					:class="[
						'inline-block px-1.5 py-0.5 rounded text-xs font-semibold',
						activeTab === tab.id
							? 'bg-gray-100 text-gray-700'
							: 'bg-gray-200 text-gray-600',
					]"
				>
					{{ tab.count }}
				</span>
			</button>
		</div>

		<!-- TAB: So'zlar -->
		<div v-if="activeTab === 'words'">
			<ul class="space-y-2">
				<li
					v-for="(word, i) in lesson.words"
					:key="i"
					class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition"
				>
					<button
						class="shrink-0 w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 flex items-center justify-center transition"
						:aria-label="`Eshitish: ${word.ar}`"
						@click="speak(word.ar)"
					>
						<svg class="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M8 5v14l11-7z" />
						</svg>
					</button>
					<div class="flex-1 min-w-0">
						<p class="text-xl text-gray-900" dir="rtl" lang="ar">
							{{ word.ar }}
						</p>
						<p class="text-sm text-gray-600">
							{{ word.uz }}
							<span v-if="word.tr" class="text-gray-400">· {{ word.tr }}</span>
						</p>
						<p
							v-if="word.ex"
							class="text-sm text-gray-500 mt-1"
							dir="rtl"
							lang="ar"
						>
							{{ word.ex }}
						</p>
					</div>
				</li>
			</ul>
		</div>

		<!-- TAB: Dialoglar -->
		<DialogueView
			v-else-if="activeTab === 'dialogues' && lesson.dialogues"
			:dialogues="lesson.dialogues"
			:lesson-number="lesson.number"
			:speak="speak"
			:stop-speak="stopSpeak"
			:speaking="speaking"
		/>

		<!-- TAB: Matn -->
		<TextView
			v-else-if="activeTab === 'texts' && lesson.texts"
			:texts="lesson.texts"
			:lesson-number="lesson.number"
			:speak="speak"
			:stop-speak="stopSpeak"
			:speaking="speaking"
		/>

		<!-- TAB: Grammatika -->
		<GrammarView
			v-else-if="activeTab === 'grammar' && lesson.grammar"
			:grammar="lesson.grammar"
			:speak="speak"
		/>

		<!-- TAB: Test -->
		<ComprehensionView
			v-else-if="activeTab === 'quiz' && lesson.comprehensionQuiz"
			:questions="lesson.comprehensionQuiz"
			:speak="speak"
		/>

		<!-- TAB: Mashqlar -->
		<ExerciseView
			v-else-if="activeTab === 'exercises' && lesson.exercises"
			:sections="lesson.exercises"
		/>
	</div>
</template>
