<script setup lang="ts">
import { computed } from 'vue';
import {
	useRepeatCounter,
	REPEAT_TARGET,
} from '@/composables/useRepeatCounter';

const props = defineProps<{
	itemKey: string; // unikal kalit (mas: 'lesson-2-text-0' yoki 'lesson-2-dialogue-0')
}>();

const counter = useRepeatCounter();

const currentCount = computed(() => counter.getCount(props.itemKey));
const isCompleted = computed(() => counter.isCompleted(props.itemKey));
const progressPct = computed(() =>
	Math.round(counter.getProgress(props.itemKey) * 100),
);

function markAsRead() {
	counter.increment(props.itemKey);
}

function resetCount() {
	if (confirm('Takrorlashni qaytadan boshlaysizmi?')) {
		counter.reset(props.itemKey);
	}
}
</script>

<template>
	<div
		:class="[
			'rounded-lg border p-3',
			isCompleted
				? 'border-emerald-300 bg-emerald-50'
				: 'border-gray-200 bg-white',
		]"
	>
		<div class="flex items-center justify-between gap-3 mb-2">
			<div class="flex items-center gap-2">
				<span class="text-xl">{{ isCompleted ? '✅' : '🔄' }}</span>
				<div>
					<div class="text-sm font-semibold text-gray-900">
						Takrorlashlar:
						<span :class="isCompleted ? 'text-emerald-700' : 'text-gray-900'">
							{{ currentCount }} / {{ REPEAT_TARGET }}
						</span>
					</div>
					<div v-if="!isCompleted" class="text-xs text-gray-500">
						Yana {{ REPEAT_TARGET - currentCount }} marta o'qish kerak
					</div>
					<div v-else class="text-xs text-emerald-700 font-medium">
						Maqsadga yetdingiz! 🎉
					</div>
				</div>
			</div>
			<button
				v-if="currentCount > 0"
				class="text-xs text-gray-500 hover:text-red-600 underline"
				@click="resetCount"
			>
				Reset
			</button>
		</div>

		<!-- Progress bar -->
		<div class="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
			<div
				:class="[
					'h-full transition-all duration-300',
					isCompleted ? 'bg-emerald-500' : 'bg-emerald-400',
				]"
				:style="{ width: `${progressPct}%` }"
			/>
		</div>

		<!-- "O'qib bo'ldim" tugmasi -->
		<button
			:disabled="isCompleted"
			:class="[
				'w-full rounded-lg px-4 py-2.5 text-sm font-medium transition',
				isCompleted
					? 'bg-gray-100 text-gray-400 cursor-not-allowed'
					: 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]',
			]"
			@click="markAsRead"
		>
			{{ isCompleted ? '✅ Tamomlandi' : `✓ O'qib bo'ldim (+1)` }}
		</button>
	</div>
</template>
