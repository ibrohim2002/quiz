<script setup lang="ts">
import { ref } from 'vue';
import type { GrammarNote } from '@/types/vocab';

defineProps<{
	grammar: GrammarNote[];
	speak: (text: string) => Promise<void> | void;
}>();

// Accordion holati — default birinchisi ochiq
const openIdx = ref<number>(0);

function toggle(i: number) {
	openIdx.value = openIdx.value === i ? -1 : i;
}
</script>

<template>
	<div class="grammar-view space-y-3">
		<div
			v-for="(note, i) in grammar"
			:key="i"
			class="rounded-lg border border-gray-200 bg-white overflow-hidden"
		>
			<!-- Header (accordion toggle) -->
			<button
				:class="[
					'w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition',
					openIdx === i ? 'bg-amber-50' : 'hover:bg-gray-50',
				]"
				@click="toggle(i)"
			>
				<div class="flex items-center gap-3 min-w-0">
					<span
						class="flex-shrink-0 w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold"
					>
						{{ i + 1 }}
					</span>
					<h4 class="font-semibold text-gray-900 truncate">
						{{ note.title }}
					</h4>
				</div>
				<svg
					:class="[
						'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform',
						openIdx === i ? 'rotate-180' : '',
					]"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
			</button>

			<!-- Content -->
			<div v-if="openIdx === i" class="px-4 pb-4 pt-1">
				<p class="text-sm text-gray-700 leading-relaxed mb-3">
					{{ note.content }}
				</p>

				<div v-if="note.examples.length" class="space-y-2">
					<p class="text-xs uppercase tracking-wide text-gray-500 font-medium">
						Misollar
					</p>
					<ul class="space-y-2">
						<li
							v-for="(ex, j) in note.examples"
							:key="j"
							class="flex items-start gap-3 p-3 rounded-md bg-gray-50"
						>
							<button
								class="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-emerald-700 hover:border-emerald-300 flex items-center justify-center transition"
								:aria-label="`Misolni eshitish: ${ex.ar}`"
								@click="speak(ex.ar)"
							>
								<svg
									class="w-3.5 h-3.5 ml-0.5"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M8 5v14l11-7z" />
								</svg>
							</button>
							<div class="flex-1 min-w-0">
								<p
									class="text-lg leading-loose text-gray-900"
									dir="rtl"
									lang="ar"
								>
									{{ ex.ar }}
								</p>
								<p class="text-sm text-gray-600 mt-0.5">{{ ex.uz }}</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
