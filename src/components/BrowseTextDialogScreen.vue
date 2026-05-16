<script setup lang="ts">
import { computed } from 'vue';
import type { Lesson } from '@/types/vocab';

const props = defineProps<{
	lessons: Lesson[];
}>();

defineEmits<{
	back: [];
	open: [n: number];
}>();

// Faqat dialog/matn bor darslar VA placeholder darslar (comingSoon)
const filteredLessons = computed(() =>
	props.lessons.filter(
		l =>
			l.comingSoon ||
			(l.dialogues?.length ?? 0) > 0 ||
			(l.texts?.length ?? 0) > 0,
	),
);

function lessonSummary(lesson: Lesson): string {
	const parts: string[] = [];
	if (lesson.dialogues?.length) {
		parts.push(`${lesson.dialogues.length} dialog`);
	}
	if (lesson.texts?.length) {
		parts.push(`${lesson.texts.length} matn`);
	}
	if (lesson.comprehensionQuiz?.length) {
		parts.push(`${lesson.comprehensionQuiz.length} test savol`);
	}
	return parts.join(' · ');
}
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

		<div
			class="mb-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800"
		>
			<h2
				class="mb-2.5 text-[14px] font-medium uppercase tracking-wider text-stone-500 dark:text-neutral-400"
			>
				Matn va dialoglar
			</h2>

			<div
				v-if="filteredLessons.length === 0"
				class="py-8 text-center text-sm text-stone-500 dark:text-neutral-400"
			>
				Hozircha matn yoki dialog qo'shilgan dars yo'q
			</div>

			<div v-else class="flex flex-col gap-3">
				<button
					v-for="lesson in filteredLessons"
					:key="lesson.number"
					:disabled="lesson.comingSoon"
					:class="[
						'w-full rounded-xl border p-4 text-left text-stone-900 transition-transform dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100',
						lesson.comingSoon
							? 'cursor-not-allowed border-stone-200 bg-stone-50 opacity-60 dark:bg-neutral-900'
							: 'cursor-pointer border-stone-200 bg-white active:scale-[0.98]',
					]"
					@click="!lesson.comingSoon && $emit('open', lesson.number)"
				>
					<div class="flex items-center justify-between">
						<div>
							<div class="text-base font-semibold">
								Dars {{ lesson.number }}: {{ lesson.titleUz }}
							</div>
							<div class="text-[13px] text-stone-500 dark:text-neutral-400">
								<span
									v-if="lesson.comingSoon"
									class="text-amber-600 dark:text-amber-400 font-medium"
								>
									⏳ Tez orada qo'shiladi
								</span>
								<span v-else>{{ lessonSummary(lesson) }}</span>
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
	</div>
</template>
