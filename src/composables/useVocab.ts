import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Lesson, VersionInfo, WordWithMeta } from '@/types/vocab'

const CACHE_KEY = 'almumtaz_vocab_cache'
const VERSION_KEY = 'almumtaz_version'
const UPDATE_CHECK_INTERVAL = 5 * 60 * 1000 // 5 daqiqa

/**
 * Loads vocab data from /lessons.json with localStorage caching.
 * Periodically checks /version.json for updates.
 */
export function useVocab() {
  const lessons = ref<Lesson[]>([])
  const isLoading = ref(true)
  const loadError = ref<string | null>(null)
  const currentVersion = ref<string>('?')
  const updateAvailable = ref(false)
  const newVersionInfo = ref<VersionInfo | null>(null)

  const allWords = computed<WordWithMeta[]>(() => {
    const list: WordWithMeta[] = []
    lessons.value.forEach((lesson) => {
      lesson.words.forEach((w, i) => {
        list.push({
          ...w,
          lesson: lesson.number,
          lessonTitle: lesson.titleUz,
          id: `${lesson.number}-${i}`,
        })
      })
    })
    return list
  })

  const cacheBust = () => `?t=${Date.now()}`

  const loadVocabData = async (): Promise<Lesson[]> => {
    const resp = await fetch(`/lessons.json${cacheBust()}`)
    if (!resp.ok) throw new Error(`lessons.json yuklanmadi (${resp.status})`)
    return (await resp.json()) as Lesson[]
  }

  const loadVersionInfo = async (): Promise<VersionInfo> => {
    const resp = await fetch(`/version.json${cacheBust()}`)
    if (!resp.ok) throw new Error(`version.json yuklanmadi (${resp.status})`)
    return (await resp.json()) as VersionInfo
  }

  const initialLoad = async () => {
    try {
      // Avval cache'dan ko'rsatamiz (agar bor bo'lsa)
      const cached = localStorage.getItem(CACHE_KEY)
      const cachedVer = localStorage.getItem(VERSION_KEY)
      if (cached && cachedVer) {
        try {
          lessons.value = JSON.parse(cached) as Lesson[]
          currentVersion.value = cachedVer
          isLoading.value = false
        } catch {
          // corrupted cache - ignore, fall through to fresh load
        }
      }

      // Versiyani tekshiramiz
      const verData = await loadVersionInfo()

      if (cachedVer && cachedVer !== verData.version) {
        // Yangilanish bor - banner ko'rsatamiz, foydalanuvchi bossa yuklaymiz
        newVersionInfo.value = verData
        updateAvailable.value = true
        return
      }

      // Birinchi marta yuklash
      if (!cached || !cachedVer) {
        const data = await loadVocabData()
        lessons.value = data
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
        localStorage.setItem(VERSION_KEY, verData.version)
        currentVersion.value = verData.version
        isLoading.value = false
      }
    } catch (err) {
      console.error('Vocab load error:', err)
      if (lessons.value.length === 0) {
        loadError.value = err instanceof Error ? err.message : 'Noma\'lum xato'
        isLoading.value = false
      }
    }
  }

  const applyUpdate = async () => {
    if (!newVersionInfo.value) return
    try {
      isLoading.value = true
      updateAvailable.value = false
      const data = await loadVocabData()
      lessons.value = data
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      localStorage.setItem(VERSION_KEY, newVersionInfo.value.version)
      currentVersion.value = newVersionInfo.value.version
      newVersionInfo.value = null
      isLoading.value = false
    } catch (err) {
      loadError.value = err instanceof Error ? err.message : 'Yangilanish xatosi'
      isLoading.value = false
    }
  }

  const checkForUpdates = async () => {
    try {
      const verData = await loadVersionInfo()
      if (verData.version !== currentVersion.value && !updateAvailable.value) {
        newVersionInfo.value = verData
        updateAvailable.value = true
      }
    } catch {
      // Network error - silently ignore
    }
  }

  let intervalId: ReturnType<typeof setInterval> | null = null
  const onVisibilityChange = () => {
    if (!document.hidden) checkForUpdates()
  }

  onMounted(() => {
    initialLoad()
    intervalId = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL)
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return {
    lessons,
    allWords,
    isLoading,
    loadError,
    currentVersion,
    updateAvailable,
    newVersionInfo,
    applyUpdate,
  }
}
