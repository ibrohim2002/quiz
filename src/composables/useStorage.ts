import { ref, watch, type Ref } from 'vue'

/**
 * Reactive localStorage wrapper.
 * Stores value as JSON, reads on init, writes on change.
 */
export function useStorage<T>(key: string, defaultValue: T): Ref<T> {
  const stored = (() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })()

  const data = ref(stored) as Ref<T>

  watch(
    data,
    (newVal) => {
      try {
        localStorage.setItem(key, JSON.stringify(newVal))
      } catch {
        // ignore (quota exceeded, etc.)
      }
    },
    { deep: true },
  )

  return data
}
