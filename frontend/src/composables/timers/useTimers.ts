import { ref } from 'vue'

interface UseTimersReturn {
  setTimer: (callback: () => void, delay: number) => void
  clearTimer: () => void
}

export function useTimers(): UseTimersReturn {
  const timer = ref<number | null>(null)

  const setTimer = (callback: () => void, delay: number): void => {
    clearTimer()
    timer.value = globalThis.setTimeout(() => {
      callback()
      timer.value = null
    }, delay)
  }

  const clearTimer = (): void => {
    if (timer.value !== null) {
      clearTimeout(timer.value)
      timer.value = null
    }
  }

  return {
    setTimer,
    clearTimer,
  }
}
