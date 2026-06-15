<script setup lang="ts">
import { ref } from 'vue';
import type { ExerciseSection } from '@/types/vocab';

defineProps<{ sections: ExerciseSection[] }>();

type AnswerState = 'unanswered' | 'correct' | 'wrong';

const answers = ref<Record<string, string | boolean | null>>({});
const states = ref<Record<string, AnswerState>>({});
const matchingSelected = ref<Record<string, string | null>>({});
const matchingMatched = ref<Record<string, Record<string, string>>>({});
const matchingWrong = ref<Record<string, string[]>>({});

function itemKey(sIdx: number, iIdx: number) {
	return `${sIdx}-${iIdx}`;
}

function selectChoice(sIdx: number, iIdx: number, choice: string, correct: string) {
	const key = itemKey(sIdx, iIdx);
	if (states.value[key] && states.value[key] !== 'unanswered') return;
	answers.value[key] = choice;
	if (!correct) return;
	states.value[key] = choice === correct ? 'correct' : 'wrong';
}

function choiceClass(sIdx: number, iIdx: number, choice: string, correct: string) {
	const key = itemKey(sIdx, iIdx);
	const state = states.value[key];
	const chosen = answers.value[key];
	if (!state || state === 'unanswered')
		return 'border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 text-gray-800';
	if (choice === correct) return 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold';
	if (choice === chosen) return 'border-red-400 bg-red-50 text-red-700';
	return 'border-gray-100 bg-gray-50 text-gray-400';
}

function selectBank(sIdx: number, iIdx: number, word: string, correct: string) {
	const key = itemKey(sIdx, iIdx);
	if (states.value[key] && states.value[key] !== 'unanswered') return;
	answers.value[key] = word;
	states.value[key] = word === correct ? 'correct' : 'wrong';
}

function bankWordClass(sIdx: number, iIdx: number, word: string, correct: string) {
	const key = itemKey(sIdx, iIdx);
	const state = states.value[key];
	const chosen = answers.value[key];
	if (!state || state === 'unanswered')
		return 'border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 text-gray-800';
	if (word === correct) return 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold';
	if (word === chosen) return 'border-red-400 bg-red-50 text-red-700';
	return 'border-gray-100 bg-gray-50 text-gray-400';
}

function selectTrueFalse(sIdx: number, iIdx: number, value: boolean, correct: boolean) {
	const key = itemKey(sIdx, iIdx);
	if (states.value[key] && states.value[key] !== 'unanswered') return;
	answers.value[key] = value;
	states.value[key] = value === correct ? 'correct' : 'wrong';
}

function tfClass(sIdx: number, iIdx: number, value: boolean, correct: boolean) {
	const key = itemKey(sIdx, iIdx);
	const state = states.value[key];
	const chosen = answers.value[key];
	if (!state || state === 'unanswered') {
		return value
			? 'border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 text-gray-700'
			: 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50 text-gray-700';
	}
	if (value === correct) return 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold';
	if (value === chosen) return 'border-red-400 bg-red-50 text-red-700';
	return 'border-gray-100 bg-gray-50 text-gray-400';
}

function selectLeft(sIdx: number, iIdx: number, left: string) {
	const key = itemKey(sIdx, iIdx);
	const matched = matchingMatched.value[key] ?? {};
	if (matched[left]) return;
	matchingSelected.value[key] = left;
}

function selectRight(
	sIdx: number,
	iIdx: number,
	right: string,
	pairs: Array<{ left: string; right: string }>,
) {
	const key = itemKey(sIdx, iIdx);
	const selectedLeft = matchingSelected.value[key];
	if (!selectedLeft) return;
	const matched = matchingMatched.value[key] ?? {};
	const correctRight = pairs.find(p => p.left === selectedLeft)?.right ?? '';
	if (right === correctRight) {
		matchingMatched.value[key] = { ...matched, [selectedLeft]: right };
	} else {
		const wrong = matchingWrong.value[key] ?? [];
		matchingWrong.value[key] = [...wrong, selectedLeft];
		setTimeout(() => {
			matchingWrong.value[key] = (matchingWrong.value[key] ?? []).filter(l => l !== selectedLeft);
		}, 700);
	}
	matchingSelected.value[key] = null;
}

function leftClass(sIdx: number, iIdx: number, left: string) {
	const key = itemKey(sIdx, iIdx);
	const matched = matchingMatched.value[key] ?? {};
	const selected = matchingSelected.value[key];
	const wrong = matchingWrong.value[key] ?? [];
	if (matched[left]) return 'border-emerald-400 bg-emerald-50 text-emerald-700 opacity-60 cursor-default';
	if (wrong.includes(left)) return 'border-red-400 bg-red-50 text-red-700';
	if (selected === left) return 'border-emerald-500 bg-emerald-100 text-emerald-900 font-semibold ring-2 ring-emerald-300';
	return 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-gray-800 cursor-pointer';
}

function rightClass(sIdx: number, iIdx: number, right: string) {
	const key = itemKey(sIdx, iIdx);
	const matched = matchingMatched.value[key] ?? {};
	const alreadyMatched = Object.values(matched).includes(right);
	const selected = matchingSelected.value[key];
	if (alreadyMatched) return 'border-emerald-400 bg-emerald-50 text-emerald-700 opacity-60 cursor-default';
	if (!selected) return 'border-gray-200 bg-gray-50 text-gray-400 cursor-default';
	return 'border-blue-400 bg-blue-50 text-blue-800 hover:border-blue-500 cursor-pointer';
}

function isMatchingComplete(sIdx: number, iIdx: number, totalPairs: number) {
	const key = itemKey(sIdx, iIdx);
	return Object.keys(matchingMatched.value[key] ?? {}).length === totalPairs;
}

function resetSection(sIdx: number, section: ExerciseSection) {
	section.items.forEach((_, iIdx) => {
		const key = itemKey(sIdx, iIdx);
		delete answers.value[key];
		delete states.value[key];
		delete matchingSelected.value[key];
		delete matchingMatched.value[key];
		delete matchingWrong.value[key];
	});
}

function stateIcon(sIdx: number, iIdx: number): string | null {
	const s = states.value[itemKey(sIdx, iIdx)];
	if (s === 'correct') return '✓';
	if (s === 'wrong') return '✗';
	return null;
}

function gdPreviewUrl(url: string): string | null {
	const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
	return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
}
</script>

<template>
	<div class="space-y-8">
		<div v-for="(section, sIdx) in sections" :key="sIdx" class="space-y-3">
			<!-- Section header -->
			<div class="flex items-center justify-between gap-2">
				<div class="min-w-0">
					<h3 class="font-bold text-gray-900 text-sm leading-tight" dir="rtl" lang="ar">
						{{ section.titleAr }}
					</h3>
					<p v-if="section.titleUz" class="text-xs text-gray-500 mt-0.5">
						{{ section.titleUz }}
					</p>
				</div>
				<button
					class="shrink-0 text-xs text-gray-400 hover:text-gray-600 underline"
					@click="resetSection(sIdx, section)"
				>
					Qayta
				</button>
			</div>

			<!-- Audio banner -->
			<div v-if="section.audioRequired" class="space-y-2">
				<div
					v-if="section.audioUrl && gdPreviewUrl(section.audioUrl)"
					class="rounded-xl overflow-hidden border border-gray-200"
				>
					<iframe
						:src="gdPreviewUrl(section.audioUrl)!"
						:title="section.titleAr"
						width="100%"
						height="80"
						frameborder="0"
						allow="autoplay"
						class="w-full block"
					/>
				</div>
				<div
					v-else
					class="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5"
				>
					<span class="shrink-0 text-base">🔊</span>
					<p class="text-xs text-amber-800 leading-snug">
						<span class="font-semibold">Audio kerak.</span>
						Kitobdagi QR-kodni skanerlang.
					</p>
				</div>
			</div>

			<!-- Exercise items -->
			<div
				v-for="(item, iIdx) in section.items"
				:key="iIdx"
				class="rounded-xl border border-gray-200 bg-white p-3.5 space-y-3"
			>
				<div class="flex items-start gap-2">
					<span class="shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center mt-0.5">
						{{ iIdx + 1 }}
					</span>
					<div class="flex-1 min-w-0">
						<p class="text-[15px] text-gray-900 leading-relaxed" dir="rtl" lang="ar">
							{{ item.ar }}
						</p>
						<p v-if="item.uz" class="text-xs text-gray-500 mt-1">
							{{ item.uz }}
						</p>
					</div>
					<span
						v-if="stateIcon(sIdx, iIdx)"
						:class="[
							'shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5',
							states[itemKey(sIdx, iIdx)] === 'correct'
								? 'bg-emerald-100 text-emerald-700'
								: 'bg-red-100 text-red-600',
						]"
					>
						{{ stateIcon(sIdx, iIdx) }}
					</span>
				</div>

				<!-- Multiple choice -->
				<div v-if="item.type === 'multiple-choice'" class="flex flex-wrap gap-2">
					<button
						v-for="choice in item.choices"
						:key="choice"
						:class="['px-3 py-1.5 rounded-lg border text-sm transition', choiceClass(sIdx, iIdx, choice, item.answer)]"
						dir="rtl"
						lang="ar"
						@click="selectChoice(sIdx, iIdx, choice, item.answer)"
					>
						{{ choice }}
					</button>
					<p v-if="!item.answer" class="w-full text-xs text-amber-600">
						Javob audio bilan tekshiriladi
					</p>
				</div>

				<!-- Fill blank -->
				<div v-else-if="item.type === 'fill-blank'" class="space-y-2">
					<div v-if="item.wordBank" class="flex flex-wrap gap-2">
						<button
							v-for="word in item.wordBank"
							:key="word"
							:class="['px-3 py-1.5 rounded-lg border text-sm transition', bankWordClass(sIdx, iIdx, word, item.answer)]"
							dir="rtl"
							lang="ar"
							@click="selectBank(sIdx, iIdx, word, item.answer)"
						>
							{{ word }}
						</button>
					</div>
					<textarea
						v-else
						class="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-800 resize-none focus:outline-none focus:border-emerald-400 focus:bg-white transition"
						rows="2"
						placeholder="Javobingizni yozing..."
						dir="rtl"
					/>
					<p
						v-if="states[itemKey(sIdx, iIdx)] === 'wrong'"
						class="text-sm text-emerald-700 font-medium"
						dir="rtl"
						lang="ar"
					>
						✓ {{ item.answer }}
					</p>
				</div>

				<!-- True / False -->
				<div v-else-if="item.type === 'true-false'" class="flex gap-2">
					<button
						:class="['flex-1 py-2 rounded-lg border text-sm font-medium transition', tfClass(sIdx, iIdx, true, item.isTrue)]"
						@click="selectTrueFalse(sIdx, iIdx, true, item.isTrue)"
					>
						✓ صَوَاب
					</button>
					<button
						:class="['flex-1 py-2 rounded-lg border text-sm font-medium transition', tfClass(sIdx, iIdx, false, item.isTrue)]"
						@click="selectTrueFalse(sIdx, iIdx, false, item.isTrue)"
					>
						✗ خَطَأ
					</button>
				</div>

				<!-- Writing -->
				<div v-else-if="item.type === 'writing'">
					<textarea
						class="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-800 resize-none focus:outline-none focus:border-emerald-400 focus:bg-white transition"
						rows="3"
						:placeholder="item.uz ?? 'Javobingizni yozing...'"
					/>
				</div>

				<!-- Matching -->
				<div v-else-if="item.type === 'matching'" class="space-y-2">
					<div class="grid grid-cols-2 gap-2">
						<div class="space-y-1.5">
							<p class="text-[11px] font-medium text-gray-400 text-center uppercase tracking-wide">Chap</p>
							<button
								v-for="pair in item.pairs"
								:key="pair.left"
								:class="['w-full px-2.5 py-2 rounded-lg border text-sm text-right transition', leftClass(sIdx, iIdx, pair.left)]"
								dir="rtl"
								lang="ar"
								@click="selectLeft(sIdx, iIdx, pair.left)"
							>
								{{ pair.left }}
							</button>
						</div>
						<div class="space-y-1.5">
							<p class="text-[11px] font-medium text-gray-400 text-center uppercase tracking-wide">O'ng</p>
							<button
								v-for="pair in item.pairs"
								:key="pair.right"
								:class="['w-full px-2.5 py-2 rounded-lg border text-sm text-right transition', rightClass(sIdx, iIdx, pair.right)]"
								dir="rtl"
								lang="ar"
								@click="selectRight(sIdx, iIdx, pair.right, item.pairs)"
							>
								{{ pair.right }}
							</button>
						</div>
					</div>
					<p v-if="matchingSelected[itemKey(sIdx, iIdx)]" class="text-xs text-blue-600 text-center">
						"{{ matchingSelected[itemKey(sIdx, iIdx)] }}" tanlandi — o'ng tomonda juftini bosing
					</p>
					<p v-if="isMatchingComplete(sIdx, iIdx, item.pairs.length)" class="text-sm text-emerald-700 font-semibold text-center">
						✓ Barcha juftlar to'g'ri!
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
