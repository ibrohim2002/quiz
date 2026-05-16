import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { Screen } from '@/types/vocab';

/**
 * Brauzer history bilan sinxron screen routing.
 *
 * `navigate(screen, params)` — yangi sahifaga o'tadi va history'ga yozadi
 * `back()` — orqaga qaytadi (history.back chaqiradi)
 * `replace(screen, params)` — joriy entry'ni almashtiradi (history'da qator qo'shmaydi)
 *
 * Android swipe-back va brauzer back tugmasi avtomatik ishlaydi:
 * popstate event tinglanadi va screen state qayta yangilanadi.
 */

export interface RouteState {
	screen: Screen;
	params?: Record<string, unknown>;
}

export function useHistoryRouter(initial: Screen = 'home') {
	const current = ref<RouteState>({ screen: initial });

	function navigate(screen: Screen, params?: Record<string, unknown>) {
		const state: RouteState = { screen, params };
		current.value = state;
		// Hash'da screen nomini saqlaymiz — qayta yuklasa to'g'ri kelishi uchun
		const hash = `#${screen}`;
		history.pushState(state, '', hash);
	}

	function replace(screen: Screen, params?: Record<string, unknown>) {
		const state: RouteState = { screen, params };
		current.value = state;
		const hash = `#${screen}`;
		history.replaceState(state, '', hash);
	}

	function back() {
		history.back();
	}

	// popstate — Android swipe-back, brauzer back tugmasi, history.back()
	function handlePopState(event: PopStateEvent) {
		const state = event.state as RouteState | null;
		if (state && state.screen) {
			current.value = state;
		} else {
			// State yo'q — boshlang'ich holat
			current.value = { screen: initial };
		}
	}

	onMounted(() => {
		// Boshlang'ich history entry — agar foydalanuvchi back bossa, bu yerga qaytadi
		// (chiqish o'rniga)
		const initialState: RouteState = { screen: initial };
		history.replaceState(initialState, '', `#${initial}`);
		window.addEventListener('popstate', handlePopState);
	});

	onBeforeUnmount(() => {
		window.removeEventListener('popstate', handlePopState);
	});

	return {
		current,
		navigate,
		replace,
		back,
	};
}
