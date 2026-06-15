import { ref, computed, watch, onUnmounted } from 'vue'
import type { ComputedRef } from 'vue'
import type { Lesson, VersionInfo, WordWithMeta, Book } from '@/types/vocab'

const UPDATE_CHECK_INTERVAL = 5 * 60 * 1000

function cacheKey(bookId: string) {
  return `vocab_cache_${bookId}`
}
function versionKey(bookId: string) {
  return `vocab_version_${bookId}`
}

export function useVocab(selectedBook: ComputedRef<Book | null>) {
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

  const loadVocabData = async (lessonsFile: string): Promise<Lesson[]> => {
    const resp = await fetch(`${lessonsFile}${cacheBust()}`)
    if (!resp.ok) throw new Error(`${lessonsFile} yuklanmadi (${resp.status})`)
    return (await resp.json()) as Lesson[]
  }

  const loadVersionInfo = async (versionFile: string): Promise<VersionInfo> => {
    const resp = await fetch(`${versionFile}${cacheBust()}`)
    if (!resp.ok) throw new Error(`${versionFile} yuklanmadi (${resp.status})`)
    return (await resp.json()) as VersionInfo
  }

  const initialLoad = async (book: Book) => {
    isLoading.value = true
    loadError.value = null
    updateAvailable.value = false
    newVersionInfo.value = null
    lessons.value = []

    const CACHE_KEY = cacheKey(book.id)
    const VERSION_KEY = versionKey(book.id)

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const cachedVer = localStorage.getItem(VERSION_KEY)
      if (cached && cachedVer) {
        try {
          lessons.value = JSON.parse(cached) as Lesson[]
          currentVersion.value = cachedVer
          isLoading.value = false
        } catch {
          // corrupted cache — ignore
        }
      }

      const verData = await loadVersionInfo(book.versionFile)

      if (cachedVer && cachedVer !== verData.version) {
        newVersionInfo.value = verData
        updateAvailable.value = true
        return
      }

      if (!cached || !cachedVer) {
        const data = await loadVocabData(book.lessonsFile)
        lessons.value = data
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
        localStorage.setItem(VERSION_KEY, verData.version)
        currentVersion.value = verData.version
        isLoading.value = false
      }
    } catch (err) {
      console.error('Vocab load error:', err)
      if (lessons.value.length === 0) {
        loadError.value = err instanceof Error ? err.message : "Noma'lum xato"
        isLoading.value = false
      }
    }
  }

  const applyUpdate = async () => {
    const book = selectedBook.value
    if (!newVersionInfo.value || !book) return
    try {
      isLoading.value = true
      updateAvailable.value = false
      const data = await loadVocabData(book.lessonsFile)
      lessons.value = data
      localStorage.setItem(cacheKey(book.id), JSON.stringify(data))
      localStorage.setItem(versionKey(book.id), newVersionInfo.value.version)
      currentVersion.value = newVersionInfo.value.version
      newVersionInfo.value = null
      isLoading.value = false
    } catch (err) {
      loadError.value = err instanceof Error ? err.message : 'Yangilanish xatosi'
      isLoading.value = false
    }
  }

  const checkForUpdates = async () => {
    const book = selectedBook.value
    if (!book) return
    try {
      const verData = await loadVersionInfo(book.versionFile)
      if (verData.version !== currentVersion.value && !updateAvailable.value) {
        newVersionInfo.value = verData
        updateAvailable.value = true
      }
    } catch {
      // silently ignore
    }
  }

  let intervalId: ReturnType<typeof setInterval> | null = null
  const onVisibilityChange = () => {
    if (!document.hidden) checkForUpdates()
  }

  watch(
    selectedBook,
    (book) => {
      if (intervalId) clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (!book) {
        isLoading.value = false
        return
      }
      initialLoad(book)
      intervalId = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL)
      document.addEventListener('visibilitychange', onVisibilityChange)
    },
    { immediate: true },
  )

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
