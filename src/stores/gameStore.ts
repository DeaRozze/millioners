import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PRIZE_STEPS } from '@/constants/game'
import { useLocalStorage } from '@vueuse/core'

export const useGameStore = defineStore('game', () => {
  const selectedAnswerId = ref<number | null>(null)
  const showResult = ref<boolean>(false)
  const prize = useLocalStorage<(typeof PRIZE_STEPS)[number]>('gameState.prize', 0)
  const currentQuestionIndex = useLocalStorage<number>('gameState.currentQuestionIndex', 0)

  const nextPrize = computed<number>(() => {
    const index = PRIZE_STEPS.indexOf(prize.value)
    if (index === -1) return PRIZE_STEPS[0]
    return index === PRIZE_STEPS.length - 1 ? PRIZE_STEPS[index] : PRIZE_STEPS[index + 1]
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
