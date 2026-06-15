<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Dialogue, DialogueLine } from '@/types/vocab';
import RepeatCounterCard from './RepeatCounterCard.vue';

const props = defineProps<{
	dialogues: Dialogue[];
	lessonNumber: number;
	speak: (text: string) => Promise<void> | void;
	stopSpeak: () => void;
	speaking: boolean;
}>();

const activeIdx = ref(0);
const activeDialogue = computed(() => props.dialogues[activeIdx.value]);

const counterKey = computed(
	() => `lesson-${props.lessonNumber}-dialogue-${activeIdx.value}`,
);

const playingLine = ref<number | null>(null);
const cancelAll = ref(false);

async function playLine(line: DialogueLine, idx: number) {
	cancelAll.value = true;
	playingLine.value = idx;
	try {
		await props.speak(line.ar);
	} finally {
		if (playingLine.value === idx) playingLine.value = null;
	}
}

async function playAll() {
	cancelAll.value = false;
	for (let i = 0; i < activeDialogue.value.lines.length; i++) {
		if (cancelAll.value) break;
		playingLine.value = i;
		await props.speak(activeDialogue.value.lines[i].ar);
		if (cancelAll.value) break;
		await new Promise(r => setTimeout(r, 400));
	}
	playingLine.value = null;
}

function stopAll() {
	cancelAll.value = true;
	props.stopSpeak();
	playingLine.value = null;
}

watch(activeIdx, () => stopAll());

const speakerColors = new Map<string, string>();
const palette = [
	'text-emerald-700 bg-emerald-50',
	'text-sky-700 bg-sky-50',
	'text-amber-700 bg-amber-50',
	'text-rose-700 bg-rose-50',
];

function speakerClass(speaker: string): string {
	if (!speakerColors.has(speaker)) {
		speakerColors.set(speaker, palette[speakerColors.size % palette.length]);
	}
	return speakerColors.get(speaker)!;
}

function gdPreviewUrl(url: string): string | null {
	const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
	return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
}
</script>

<template>
	<div class="dialogue-view">
		<!-- Dialog selektori -->
		<div
			v-if="dialogues.length > 1"
			class="flex gap-2 mb-4 overflow-x-auto pb-1"
		>
			<button
				v-for="(d, i) in dialogues"
				:key="i"
				:class="[
					'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition',
					activeIdx === i
						? 'bg-emerald-600 text-white shadow-sm'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
				]"
				@click="activeIdx = i"
			>
				{{ d.titleUz || d.title }}
			</button>
		</div>

		<!-- Sarlavha va Eshitish -->
		<div class="flex items-center justify-between mb-3 gap-3">
			<div class="min-w-0">
				<h3 class="text-xl font-bold text-gray-900 truncate" dir="rtl">
					{{ activeDialogue.title }}
				</h3>
				<p
					v-if="activeDialogue.titleUz"
					class="text-sm text-gray-500 mt-0.5 truncate"
				>
					{{ activeDialogue.titleUz }}
				</p>
			</div>

			<button
				:class="[
					'shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
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

		<!-- Google Drive audio player -->
		<div v-if="activeDialogue.audioUrl" class="mb-4">
			<iframe
				:src="gdPreviewUrl(activeDialogue.audioUrl) ?? activeDialogue.audioUrl"
				:title="`${activeDialogue.title} audio`"
				width="100%"
				height="80"
				frameborder="0"
				allow="autoplay"
				class="rounded-xl border border-gray-200 w-full"
			/>
		</div>

		<!-- Takrorlash hisoblagichi -->
		<div class="mb-4">
			<RepeatCounterCard :item-key="counterKey" />
		</div>

		<!-- Narrative kirish -->
		<div
			v-if="activeDialogue.intro"
			class="mb-4 p-4 rounded-lg bg-gray-50 border-l-4 border-gray-300"
		>
			<p class="text-lg leading-relaxed text-gray-800" dir="rtl">
				{{ activeDialogue.intro }}
			</p>
			<p v-if="activeDialogue.introUz" class="text-sm text-gray-600 mt-2">
				{{ activeDialogue.introUz }}
			</p>
		</div>

		<!-- Qatorlar -->
		<ul class="space-y-3">
			<li
				v-for="(line, i) in activeDialogue.lines"
				:key="i"
				:class="[
					'rounded-lg border transition',
					playingLine === i
						? 'border-emerald-400 bg-emerald-50/40 shadow-sm'
						: 'border-gray-200 bg-white hover:border-gray-300',
				]"
			>
				<div class="p-3 sm:p-4 flex gap-3">
					<div class="shrink-0 pt-0.5">
						<span
							:class="[
								'inline-block px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap',
								speakerClass(line.speaker),
							]"
							dir="rtl"
						>
							{{ line.speaker }}
						</span>
					</div>

					<div class="flex-1 min-w-0">
						<p
							class="text-xl sm:text-2xl leading-loose text-gray-900"
							dir="rtl"
							lang="ar"
						>
							{{ line.ar }}
						</p>
						<p class="text-sm text-gray-600 mt-1.5 leading-relaxed">
							{{ line.uz }}
						</p>
					</div>

					<button
						:class="[
							'shrink-0 self-start w-9 h-9 rounded-full flex items-center justify-center transition',
							playingLine === i
								? 'bg-emerald-600 text-white'
								: 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700',
						]"
						:aria-label="`${line.speaker} gapini eshitish`"
						@click="playLine(line, i)"
					>
						<svg
							v-if="playingLine === i"
							class="w-4 h-4"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<rect x="6" y="5" width="4" height="14" rx="1" />
							<rect x="14" y="5" width="4" height="14" rx="1" />
						</svg>
						<svg
							v-else
							class="w-4 h-4 ml-0.5"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M8 5v14l11-7z" />
						</svg>
					</button>
				</div>
			</li>
		</ul>
	</div>
</template>
