<script setup lang="ts">
import { computed } from 'vue';
import type { Lesson, MistakeEntry } from '@/types/vocab';

const props = defineProps<{
	lessons: Lesson[];
	mistakes: Record<string, MistakeEntry>;
	bookTitle?: string;
}>();

defineEmits<{
	backToBooks: [];
	openLesson: [n: number];
	startQuiz: [];
	practiceMistakes: [];
	clearMistakes: [];
	resetStats: [];
}>();

const mistakesCount = computed(() => Object.keys(props.mistakes).length);
</script>

<template>
	<div class="flex flex-1 flex-col">
		<!-- Header: kitoblarga qaytish + kitob nomi -->
		<div class="mb-4 flex items-center gap-2">
			<button
				class="cursor-pointer rounded-lg border border-stone-200 bg-transparent px-3 py-2 text-[13px] text-stone-900 dark:border-neutral-700 dark:text-neutral-100"
				@click="$emit('backToBooks')"
			>
				‹ Kitoblar
			</button>
			<div
				v-if="bookTitle"
				class="truncate text-[13px] text-stone-500 dark:text-neutral-400"
			>
				{{ bookTitle }}
			</div>
		</div>

		<!-- Tezkor amallar -->
		<div class="mb-4 flex flex-col gap-3">
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
					<div class="text-[13px] text-white/85">Flashcard yoki test rejimida</div>
				</div>
			</button>

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
					<div class="text-base font-semibold text-amber-600 dark:text-amber-400">
						Xatolar ustida ishlash
					</div>
					<div class="text-[13px] text-stone-500 dark:text-neutral-400">
						{{ mistakesCount }} ta xato qilingan so'z
					</div>
				</div>
			</button>
		</div>

		<!-- Darslar ro'yxati -->
		<div
			class="mb-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
		>
			<h2
				class="mb-2.5 text-[14px] font-medium uppercase tracking-wider text-stone-500 dark:text-neutral-400"
			>
				Darslar
			</h2>
			<div class="flex flex-col gap-3">
				<button
					v-for="lesson in lessons"
					:key="lesson.number"
					:disabled="lesson.comingSoon"
					:class="[
						'w-full rounded-xl border p-4 text-left text-stone-900 transition-transform dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100',
						lesson.comingSoon
							? 'cursor-not-allowed border-stone-200 bg-stone-50 opacity-60 dark:bg-neutral-900'
							: 'cursor-pointer border-stone-200 bg-white active:scale-[0.98]',
					]"
					@click="!lesson.comingSoon && $emit('openLesson', lesson.number)"
				>
					<div class="flex items-center justify-between">
						<div>
							<div class="text-base font-semibold">
								Dars {{ lesson.number }}: {{ lesson.titleUz }}
							</div>
							<div class="text-[13px] text-stone-500 dark:text-neutral-400">
								<span
									v-if="lesson.comingSoon"
									class="font-medium text-amber-600 dark:text-amber-400"
								>
									⏳ Tez orada qo'shiladi
								</span>
								<span v-else>{{ lesson.words.length }} ta so'z</span>
							</div>
						</div>
						<div class="text-lg text-stone-400 dark:text-neutral-500">
							{{ lesson.comingSoon ? '🔒' : '›' }}
						</div>
					</div>
					<div
						class="arabic-text mt-1.5 text-xl text-brand-600 dark:text-brand-400"
					>
						{{ lesson.titleAr }}
					</div>
				</button>
			</div>
		</div>

		<!-- Footer: statistika -->
		<div class="mt-auto flex flex-col gap-2 pt-2">
			<button
				v-if="mistakesCount > 0"
				class="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-base font-medium text-stone-900 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
				@click="$emit('clearMistakes')"
			>
				Xatolar ro'yxatini tozalash
			</button>
			<button
				class="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-base font-medium text-stone-900 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
				@click="$emit('resetStats')"
			>
				Statistikani tozalash
			</button>
		</div>
	</div>
</template>
