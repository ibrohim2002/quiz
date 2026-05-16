import { computed } from 'vue';
import { useStorage } from './useStorage';

/**
 * Har "item" (matn yoki dialog) uchun takrorlash hisoblagichi.
 * Maqsad: 20 marta. localStorage da saqlanadi.
 *
 * Foydalanish:
 *   const counter = useRepeatCounter()
 *   counter.getCount('lesson-2-text-0')     // 7
 *   counter.increment('lesson-2-text-0')    // 7 → 8
 *   counter.isCompleted('lesson-2-text-0')  // false
 *   counter.reset('lesson-2-text-0')        // 0
 */

export const REPEAT_TARGET = 20;

type CountMap = Record<string, number>;

export function useRepeatCounter() {
	const counts = useStorage<CountMap>('almumtaz_repeat_counts', {});

	function getCount(key: string): number {
		return counts.value[key] ?? 0;
	}

	function increment(key: string): number {
		const current = counts.value[key] ?? 0;
		// 20 dan oshmasin
		const next = Math.min(current + 1, REPEAT_TARGET);
		counts.value = { ...counts.value, [key]: next };
		return next;
	}

	function reset(key: string): void {
		const updated = { ...counts.value };
		delete updated[key];
		counts.value = updated;
	}

	function isCompleted(key: string): boolean {
		return (counts.value[key] ?? 0) >= REPEAT_TARGET;
	}

	function getProgress(key: string): number {
		return Math.min((counts.value[key] ?? 0) / REPEAT_TARGET, 1);
	}

	return {
		counts: computed(() => counts.value),
		getCount,
		increment,
		reset,
		isCompleted,
		getProgress,
		target: REPEAT_TARGET,
	};
}
