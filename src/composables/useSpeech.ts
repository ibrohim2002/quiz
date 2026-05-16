import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * Browser TTS for Arabic words and sentences.
 * Picks an Arabic voice if available, falls back to default.
 *
 * `speak()` returns a Promise that resolves when the utterance finishes
 * (or is cancelled), so callers can chain multiple lines with `await`.
 */
export function useSpeech() {
	const arabicVoice = ref<SpeechSynthesisVoice | null>(null);
	const isSupported = ref('speechSynthesis' in window);
	const speaking = ref(false);

	const loadVoices = () => {
		if (!isSupported.value) return;
		const voices = window.speechSynthesis.getVoices();
		arabicVoice.value = voices.find(v => v.lang.startsWith('ar')) ?? null;
	};

	onMounted(() => {
		loadVoices();
		if (isSupported.value) {
			window.speechSynthesis.onvoiceschanged = loadVoices;
		}
	});

	// Komponent unmount bo'lsa, ovoz to'xtasin
	onBeforeUnmount(() => {
		if (isSupported.value) {
			window.speechSynthesis.cancel();
			speaking.value = false;
		}
	});

	const speak = (text: string): Promise<void> => {
		if (!isSupported.value) return Promise.resolve();

		return new Promise<void>(resolve => {
			window.speechSynthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = 'ar-SA';
			if (arabicVoice.value) utterance.voice = arabicVoice.value;
			utterance.rate = 0.85;

			utterance.onstart = () => {
				speaking.value = true;
			};
			utterance.onend = () => {
				speaking.value = false;
				resolve();
			};
			utterance.onerror = () => {
				speaking.value = false;
				resolve(); // reject emas — chunki .cancel() ham error chaqiradi
			};

			window.speechSynthesis.speak(utterance);
		});
	};

	const stop = () => {
		if (!isSupported.value) return;
		window.speechSynthesis.cancel();
		speaking.value = false;
	};

	return { speak, stop, speaking, isSupported };
}
