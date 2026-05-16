<script setup lang="ts">
import type { VersionInfo } from '@/types/vocab';

defineProps<{
	versionInfo: VersionInfo;
}>();

defineEmits<{
	apply: [];
}>();
</script>

<template>
	<div
		class="mb-4 flex flex-col items-center gap-3 rounded-xl border border-blue-500 bg-blue-50 p-3 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
	>
		<!-- <div class="text-2xl">🔄</div> -->
		<div class="flex-1">
			<div class="text-sm font-semibold">
				Yangilanish bor (v{{ versionInfo.version }})
			</div>
			<div class="mt-0.5 text-xs opacity-85">{{ versionInfo.changelog }}</div>
		</div>
		<button
			class="cursor-pointer ml-auto whitespace-nowrap rounded-lg border-0 bg-blue-600 px-3.5 py-2 text-[13px] font-medium text-white active:scale-[0.98]"
			@click="$emit('apply')"
		>
			Yangilash
		</button>
	</div>
</template>
