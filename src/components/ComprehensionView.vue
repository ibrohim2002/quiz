<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ComprehensionQuestion } from '@/types/vocab';

const props = defineProps<{
	questions: ComprehensionQuestion[];
	speak: (text: string) => Promise<void> | void;
}>();

// === Test holati ===
const currentIdx = ref(0);
const selectedAnswer = ref<string | null>(null);
const answered = ref(false);
const correctCount = ref(0);
const wrongCount = ref(0);
const finished = ref(false);

const currentQuestion = computed(() => props.questions[currentIdx.value]);

// Variantlarni aralashtirish — har savol uchun bir marta hisoblanadi va saqlanadi.
// Math.random ishlatamiz, bu eng oddiy va kafolatlangan ishlaydi.
const shuffledCache = ref<Map<number, string[]>>(new Map());

function shuffleArray<T>(arr: T[]): T[] {
	const result = [...arr];
	// Fisher-Yates shuffle
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

const shuffledChoices = computed<string[]>(() => {
	const q = currentQuestion.value;
	if (!q.choices) return [];

	// Cache'dan tekshirish — agar shu savol uchun allaqachon aralashgan bo'lsa
	if (shuffledCache.value.has(currentIdx.value)) {
		return shuffledCache.value.get(currentIdx.value)!;
	}

	// Yangi aralashtirish
	const shuffled = shuffleArray(q.choices);
	shuffledCache.value.set(currentIdx.value, shuffled);
	return shuffled;
});

function selectAnswer(choice: string) {
	if (answered.value) return;
	selectedAnswer.value = choice;
	answered.value = true;
	if (choice === currentQuestion.value.answer.ar) {
		correctCount.value++;
	} else {
		wrongCount.value++;
	}
	// Avtomatik to'g'ri javobni o'qish
	// props.speak(currentQuestion.value.answer.ar);
}

function nextQuestion() {
	if (currentIdx.value < props.questions.length - 1) {
		currentIdx.value++;
		selectedAnswer.value = null;
		answered.value = false;
	} else {
		finished.value = true;
	}
}

function restart() {
	currentIdx.value = 0;
	selectedAnswer.value = null;
	answered.value = false;
	correctCount.value = 0;
	wrongCount.value = 0;
	finished.value = false;
	// Cache'ni tozalaymiz — qaytadan aralashish uchun
	shuffledCache.value.clear();
}

// Savollar to'plami o'zgarganda (dars almashtirilganda) — qayta boshlash
watch(
	() => props.questions,
	() => restart(),
);

const progressPct = computed(() =>
	Math.round(
		((currentIdx.value + (answered.value ? 1 : 0)) / props.questions.length) *
			100,
	),
);

function getChoiceClass(choice: string): string {
	if (!answered.value) {
		return 'border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30';
	}
	const isCorrect = choice === currentQuestion.value.answer.ar;
	const isSelected = choice === selectedAnswer.value;
	if (isCorrect) return 'border-emerald-500 bg-emerald-50 text-emerald-900';
	if (isSelected) return 'border-red-400 bg-red-50 text-red-900';
	return 'border-gray-200 bg-white opacity-60';
}
</script>

<template>
	<div class="comprehension-view">
		<!-- Natija ekrani -->
		<div
			v-if="finished"
			class="text-center py-8 rounded-lg border border-gray-200 bg-white"
		>
			<div class="text-5xl mb-3">
				{{
					correctCount === questions.length
						? '🎉'
						: correctCount > questions.length / 2
							? '👍'
							: '📚'
				}}
			</div>
			<h3 class="text-xl font-bold text-gray-900 mb-2">Test tugadi!</h3>
			<p class="text-gray-600 mb-4">
				Natija:
				<span class="font-bold text-emerald-700">{{ correctCount }}</span>
				/ {{ questions.length }} to'g'ri javob
			</p>
			<div class="flex justify-center gap-3">
				<div
					class="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold"
				>
					✓ {{ correctCount }}
				</div>
				<div
					class="px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-semibold"
				>
					✗ {{ wrongCount }}
				</div>
			</div>
			<button
				class="mt-6 px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
				@click="restart"
			>
				Qaytadan boshlash
			</button>
		</div>

		<!-- Test ekrani -->
		<div v-else>
			<!-- Progress -->
			<div class="mb-4">
				<div
					class="flex items-center justify-between mb-2 text-sm text-gray-600"
				>
					<span>Savol {{ currentIdx + 1 }} / {{ questions.length }}</span>
					<div class="flex gap-2">
						<span class="text-emerald-700 font-medium"
							>✓ {{ correctCount }}</span
						>
						<span class="text-red-700 font-medium">✗ {{ wrongCount }}</span>
					</div>
				</div>
				<div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
					<div
						class="h-full bg-emerald-500 transition-all duration-300"
						:style="{ width: `${progressPct}%` }"
					/>
				</div>
			</div>

			<!-- Savol -->
			<div class="rounded-lg border border-gray-200 bg-white p-4 mb-4">
				<p
					class="text-xl sm:text-2xl leading-loose text-gray-900 mb-2"
					dir="rtl"
					lang="ar"
				>
					{{ currentQuestion.ar }}
				</p>
				<p class="text-sm text-gray-500">{{ currentQuestion.uz }}</p>
			</div>

			<!-- Variantlar -->
			<ul class="space-y-2 mb-4">
				<li v-for="(choice, i) in shuffledChoices" :key="`${currentIdx}-${i}`">
					<button
						:class="[
							'w-full text-right rounded-lg border-2 p-3 transition',
							getChoiceClass(choice),
						]"
						:disabled="answered"
						@click="selectAnswer(choice)"
					>
						<p class="text-lg leading-loose text-gray-900" dir="rtl" lang="ar">
							{{ choice }}
						</p>
					</button>
				</li>
			</ul>

			<!-- Javobdan keyin: tarjima va Keyingi tugma -->
			<div v-if="answered" class="space-y-3">
				<div class="rounded-lg bg-gray-50 p-3">
					<p
						class="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1"
					>
						To'g'ri javob
					</p>
					<p class="text-sm text-gray-700">
						{{ currentQuestion.answer.uz }}
					</p>
				</div>

				<button
					class="w-full px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
					@click="nextQuestion"
				>
					{{
						currentIdx < questions.length - 1 ? 'Keyingi savol →' : 'Yakunlash'
					}}
				</button>
			</div>
		</div>
	</div>
</template>
