<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { LessonText } from '@/types/vocab';
import RepeatCounterCard from './RepeatCounterCard.vue';

const props = defineProps<{
	texts: LessonText[];
	lessonNumber: number;
	speak: (text: string) => Promise<void> | void;
	stopSpeak: () => void;
	speaking: boolean;
}>();

const activeIdx = ref(0);
const activeText = computed(() => props.texts[activeIdx.value]);

// Counter uchun unikal kalit
const counterKey = computed(
	() => `lesson-${props.lessonNumber}-text-${activeIdx.value}`,
);

const sentences = computed(() => {
	return activeText.value.ar
		.split(/(?<=[.!؟])\s+/)
		.map(s => s.trim())
		.filter(s => s.length > 0);
});

const playingSentence = ref<number | null>(null);
const cancelAll = ref(false);

async function playSentence(text: string, idx: number) {
	cancelAll.value = true;
	playingSentence.value = idx;
	try {
		await props.speak(text);
	} finally {
		if (playingSentence.value === idx) playingSentence.value = null;
	}
}

async function playAll() {
	cancelAll.value = false;
	for (let i = 0; i < sentences.value.length; i++) {
		if (cancelAll.value) break;
		playingSentence.value = i;
		await props.speak(sentences.value[i]);
		if (cancelAll.value) break;
		await new Promise(r => setTimeout(r, 400));
	}
	playingSentence.value = null;
}

function stopAll() {
	cancelAll.value = true;
	props.stopSpeak();
	playingSentence.value = null;
}

watch(activeIdx, () => stopAll());
</script>

<template>
	<div class="text-view">
		<!-- Matn selektori -->
		<div v-if="texts.length > 1" class="flex gap-2 mb-4 overflow-x-auto pb-1">
			<button
				v-for="(t, i) in texts"
				:key="i"
				:class="[
					'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition',
					activeIdx === i
						? 'bg-emerald-600 text-white shadow-sm'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
				]"
				@click="activeIdx = i"
			>
				{{ t.titleUz || t.title }}
			</button>
		</div>

		<!-- Sarlavha va "Eshitish" -->
		<div class="flex items-center justify-between mb-3 gap-3">
			<div class="min-w-0">
				<h3 class="text-xl font-bold text-gray-900 truncate" dir="rtl">
					{{ activeText.title }}
				</h3>
				<p
					v-if="activeText.titleUz"
					class="text-sm text-gray-500 mt-0.5 truncate"
				>
					{{ activeText.titleUz }}
				</p>
			</div>

			<button
				:class="[
					'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
					speaking
						? 'bg-red-50 text-red-700 hover:bg-red-100'
						: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
				]"
				@click="speaking ? stopAll() : playAll()"
			>
				<span v-if="speaking">⏸ To'xtatish</span>
				<span v-else>▶ Eshitish</span>
			</button>
		</div>

		<!-- Takrorlash hisoblagichi -->
		<div class="mb-4">
			<RepeatCounterCard :item-key="counterKey" />
		</div>

		<!-- Arabcha matn -->
		<div
			class="rounded-lg border border-gray-200 bg-white p-4 mb-4"
			dir="rtl"
			lang="ar"
		>
			<p class="text-xl sm:text-2xl leading-loose text-gray-900">
				<span
					v-for="(s, i) in sentences"
					:key="i"
					:class="[
						'inline cursor-pointer rounded transition px-0.5',
						playingSentence === i
							? 'bg-emerald-100 text-emerald-900'
							: 'hover:bg-emerald-50',
					]"
					@click="playSentence(s, i)"
				>
					{{ s }}
				</span>
			</p>
		</div>

		<!-- O'zbekcha tarjima -->
		<div class="rounded-lg bg-gray-50 p-4">
			<p class="text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">
				Tarjima
			</p>
			<p class="text-sm sm:text-base text-gray-700 leading-relaxed">
				{{ activeText.uz }}
			</p>
		</div>
	</div>
</template>
