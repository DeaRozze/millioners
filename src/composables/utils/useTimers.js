import { ref } from 'vue'

export function useTimers() {
  const timer = ref(null)

  const setTimer = (callback, delay) => {
    clearTimer()
    timer.value = setTimeout(() => {
      callback()
      timer.value = null
    }, delay)
  }

  const clearTimer = () => {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
  }

  return {
    setTimer,
    clearTimer,
  }
}
