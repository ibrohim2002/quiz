import { ref, onMounted } from 'vue'

/**
 * Browser TTS for Arabic words.
 * Picks an Arabic voice if available, falls back to default.
 */
export function useSpeech() {
  const arabicVoice = ref<SpeechSynthesisVoice | null>(null)
  const isSupported = ref('speechSynthesis' in window)

  const loadVoices = () => {
    if (!isSupported.value) return
    const voices = window.speechSynthesis.getVoices()
    arabicVoice.value =
      voices.find((v) => v.lang.startsWith('ar')) ?? null
  }

  onMounted(() => {
    loadVoices()
    if (isSupported.value) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  })

  const speak = (text: string) => {
    if (!isSupported.value) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ar-SA'
    if (arabicVoice.value) utterance.voice = arabicVoice.value
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  return { speak, isSupported }
}
