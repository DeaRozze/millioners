import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PRIZE_STEPS } from '@/constants/game'
import { useLocalStorage } from '@vueuse/core'

export const useGameStore = defineStore('game', () => {
  const selectedAnswerId = ref<number | null>(null)
  const showResult = ref<boolean>(false)
  const prize = useLocalStorage<number>('gameState.prize', 0)
  const currentQuestionIndex = useLocalStorage<number>('gameState.currentQuestionIndex', 0)

  const nextPrize = computed<number>(() => {
    if (prize.value === 0) return PRIZE_STEPS[0]
    const currentPosition = PRIZE_STEPS.indexOf(prize.value)
    return currentPosition === PRIZE_STEPS.length - 1
      ? PRIZE_STEPS[currentPosition]
      : PRIZE_STEPS[currentPosition + 1]
  })

  const resetGameState = (): void => {
    selectedAnswerId.value = null
    showResult.value = false
    prize.value = 0
    currentQuestionIndex.value = 0
  }

  return {
    selectedAnswerId,
    showResult,
    prize,
    currentQuestionIndex,

    nextPrize,

    resetGameState,
  }
})
