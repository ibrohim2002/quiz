<script setup lang="ts">
import { computed } from 'vue';
import type { MistakeEntry } from '@/types/vocab';

const props = defineProps<{
	mistakes: Record<string, MistakeEntry>;
	bookTitle?: string;
}>();

defineEmits<{
	backToBooks: [];
	startQuiz: [];
	browse: [];
	browseTextDialog: [];
	browseGrammar: [];
	browseExercises: [];
	practiceMistakes: [];
	clearMistakes: [];
	resetStats: [];
}>();

const mistakesCount = computed(() => Object.keys(props.mistakes).length);

const topMistakes = computed(() =>
	Object.values(props.mistakes)
		.sort((a, b) => b.count - a.count)
		.slice(0, 10),
);
</script>

<template>
	<div class="flex flex-1 flex-col">
		<!-- Kitoblarga qaytish -->
		<div class="mb-3 flex items-center gap-2">
			<button
				class="cursor-pointer rounded-lg border border-stone-200 bg-transparent px-3 py-2 text-[13px] text-stone-900 dark:border-neutral-700 dark:text-neutral-100"
				@click="$emit('backToBooks')"
			>
				‹ Kitoblar
			</button>
			<div
				v-if="bookTitle"
				class="text-[13px] text-stone-500 dark:text-neutral-400 truncate"
			>
				{{ bookTitle }}
			</div>
		</div>

		<div class="mb-4 flex flex-col gap-3">
			<!-- Quiz boshlash -->
			<button
				class="flex w-full cursor-pointer items-center gap-3.5 rounded-xl border border-brand-500 bg-brand-500 p-4.5 text-left text-base text-white shadow-sm transition-transform active:scale-[0.98]"
				@click="$emit('startQuiz')"
			>
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-white/20 text-[22px]"
				>
					🎯
				</div>
				<div class="flex-1">
					<div class="text-base font-semibold">Quiz boshlash</div>
					<div class="text-[13px] text-white/85">
						Flashcard yoki test rejimida
					</div>
				</div>
			</button>

			<!-- Matn / Dialog -->
			<button
				class="flex w-full cursor-pointer items-center gap-3.5 rounded-xl border border-stone-200 bg-white p-4.5 text-left text-base text-stone-900 shadow-sm transition-transform active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
				@click="$emit('browseTextDialog')"
			>
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand-50 text-[22px] dark:bg-brand-700/30"
				>
					💬
				</div>
				<div class="flex-1">
					<div class="text-base font-semibold">Matn va dialoglar</div>
					<div class="text-[13px] text-stone-500 dark:text-neutral-400">
						Suhbatlarni o'qing va tinglang
					</div>
				</div>
			</button>

			<!-- Qoidalar -->
			<button
				class="flex w-full cursor-pointer items-center gap-3.5 rounded-xl border border-stone-200 bg-white p-4.5 text-left text-base text-stone-900 shadow-sm transition-transform active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
				@click="$emit('browseGrammar')"
			>
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-amber-50 text-[22px] dark:bg-amber-700/30"
				>
					📚
				</div>
				<div class="flex-1">
					<div class="text-base font-semibold">Qoidalar</div>
					<div class="text-[13px] text-stone-500 dark:text-neutral-400">
						Grammatika qoidalari va misollar
					</div>
				</div>
			</button>

			<!-- Mashqlar -->
			<button
				class="flex w-full cursor-pointer items-center gap-3.5 rounded-xl border border-stone-200 bg-white p-4.5 text-left text-base text-stone-900 shadow-sm transition-transform active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
				@click="$emit('browseExercises')"
			>
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-violet-50 text-[22px] dark:bg-violet-700/30"
				>
					✏️
				</div>
				<div class="flex-1">
					<div class="text-base font-semibold">Mashqlar</div>
					<div class="text-[13px] text-stone-500 dark:text-neutral-400">
						Savol va topshiriqlar bilan mustahkamlash
					</div>
				</div>
			</button>

			<!-- Lug'at -->
			<button
				class="flex w-full cursor-pointer items-center gap-3.5 rounded-xl border border-stone-200 bg-white p-4.5 text-left text-base text-stone-900 shadow-sm transition-transform active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
				@click="$emit('browse')"
			>
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-sky-50 text-[22px] dark:bg-sky-700/30"
				>
					📖
				</div>
				<div class="flex-1">
					<div class="text-base font-semibold">Lug'at</div>
					<div class="text-[13px] text-stone-500 dark:text-neutral-400">
						Har bir dars so'zlarini o'rganish
					</div>
				</div>
			</button>

			<!-- Xatolar -->
			<button
				v-if="mistakesCount > 0"
				class="flex w-full cursor-pointer items-center gap-3.5 rounded-xl border border-stone-200 bg-white p-4.5 text-left text-base text-stone-900 shadow-sm transition-transform active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
				@click="$emit('practiceMistakes')"
			>
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-amber-500 text-[22px]"
				>
					⚠️
				</div>
				<div class="flex-1">
					<div
						class="text-base font-semibold text-amber-600 dark:text-amber-400"
					>
						Xatolar ustida ishlash
					</div>
					<div class="text-[13px] text-stone-500 dark:text-neutral-400">
						{{ mistakesCount }} ta xato qilingan so'z
					</div>
				</div>
			</button>
		</div>

		<!-- Xatolar ro'yxati -->
		<div
			v-if="mistakesCount > 0"
			class="mb-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
		>
			<h2
				class="mb-2.5 text-[14px] font-medium uppercase tracking-wider text-stone-500 dark:text-neutral-400"
			>
				Xatolar ro'yxati
			</h2>
			<div class="flex flex-col gap-2">
				<div
					v-for="m in topMistakes"
					:key="m.word.id"
					class="grid grid-cols-2 items-center gap-3 rounded-[10px] border border-stone-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
				>
					<div class="arabic-text text-right text-2xl">{{ m.word.ar }}</div>
					<div>
						<div class="text-[15px]">{{ m.word.uz }}</div>
						<div
							class="mt-0.5 text-xs italic text-stone-500 dark:text-neutral-400"
						>
							{{ m.word.tr }} · Dars {{ m.word.lesson }} · ✗{{ m.count }}
						</div>
					</div>
				</div>
			</div>
			<button
				class="mt-3 w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-base font-medium text-stone-900 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
				@click="$emit('clearMistakes')"
			>
				Xatolar ro'yxatini tozalash
			</button>
		</div>

		<div class="mt-auto pt-4">
			<button
				class="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-base font-medium text-stone-900 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
				@click="$emit('resetStats')"
			>
				Statistikani tozalash
			</button>
		</div>
	</div>
</template>
